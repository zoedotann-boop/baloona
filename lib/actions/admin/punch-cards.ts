"use server"

import { randomUUID } from "node:crypto"

import { desc, eq } from "drizzle-orm"
import { getLocale } from "next-intl/server"
import { z } from "zod"

import { defaultLocale, type Locale } from "@/i18n/routing"
import { requireLocationAccess } from "@/lib/admin/access"
import { db } from "@/lib/db"
import { searchCustomerCards } from "@/lib/db/queries/admin"
import {
  customers,
  punchCardOrders,
  punchCards,
  punchEvents,
} from "@/lib/db/schema"
import { sendPunchCardConfirmation } from "@/lib/email/punch-card-confirmation"
import { sendPunchNotification } from "@/lib/email/punch-notification"
import { formatDateTime, formatPrice, pickLocale } from "@/lib/localized"
import { remainingPunches, type CustomerCardsView } from "@/lib/punch-cards"
import { siteOrigin } from "@/lib/site-url"

import { OK, type ActionResult } from "./shared"

function toView(
  rows: Awaited<ReturnType<typeof searchCustomerCards>>,
  locale: Locale
): CustomerCardsView[] {
  return rows.map((customer) => ({
    id: customer.id,
    fullName: customer.fullName,
    phone: customer.phone,
    email: customer.email,
    cards: customer.cards.map((card) => ({
      id: card.id,
      token: card.token,
      totalPunches: card.totalPunches,
      usedPunches: card.usedPunches,
      status: card.status,
      issuedByLocationName: card.issuedByLocation
        ? pickLocale(card.issuedByLocation.name, locale)
        : null,
      note: card.note,
      createdAt: formatDateTime(card.createdAt, locale),
      punches: card.events.map((event) => ({
        id: event.id,
        at: formatDateTime(event.createdAt, locale),
        branchName: event.location
          ? pickLocale(event.location.name, locale)
          : null,
      })),
      payment: card.order
        ? {
            paid: card.order.status === "paid",
            price: formatPrice(card.order.amount, locale),
          }
        : null,
    })),
  }))
}

const searchSchema = z.object({
  slug: z.string().min(1),
  query: z.string().optional(),
})

export async function searchPunchCards(
  input: z.input<typeof searchSchema>
): Promise<CustomerCardsView[]> {
  await requireLocationAccess(input.slug, "operations")

  const parsed = searchSchema.safeParse(input)
  if (!parsed.success) return []

  const [rows, locale] = await Promise.all([
    searchCustomerCards(parsed.data.query),
    getLocale() as Promise<Locale>,
  ])
  return toView(rows, locale)
}

const issueSchema = z
  .object({
    slug: z.string().min(1),
    phone: z.string().trim().min(1),
    fullName: z.string().trim().default(""),
    email: z.string().trim().default(""),
    note: z.string().trim().default(""),
    totalPunches: z.coerce.number().int().min(1).max(100),
    remainingPunches: z.coerce.number().int().min(0),
  })
  .refine((data) => data.remainingPunches <= data.totalPunches, {
    path: ["remainingPunches"],
  })

export async function issuePunchCard(
  input: z.input<typeof issueSchema>
): Promise<ActionResult> {
  const { location } = await requireLocationAccess(input.slug, "operations")

  const parsed = issueSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }
  const { phone, fullName, email, note, totalPunches, remainingPunches } =
    parsed.data

  const existing = await db.query.customers.findFirst({
    where: eq(customers.phone, phone),
  })

  let customerId: string
  let recipientEmail: string | null
  if (existing) {
    customerId = existing.id
    recipientEmail = email || existing.email || null
    const patch: Partial<typeof customers.$inferInsert> = {}
    if (fullName) patch.fullName = fullName
    if (email) patch.email = email
    if (Object.keys(patch).length > 0) {
      await db.update(customers).set(patch).where(eq(customers.id, customerId))
    }
  } else {
    recipientEmail = email || null
    const [created] = await db
      .insert(customers)
      .values({ phone, fullName, email: email || null })
      .returning({ id: customers.id })
    customerId = created.id
  }

  const token = randomUUID()
  const usedPunches = totalPunches - remainingPunches
  await db.insert(punchCards).values({
    token,
    customerId,
    totalPunches,
    usedPunches,
    status: usedPunches >= totalPunches ? "completed" : "active",
    issuedByLocationId: location.id,
    note: note || null,
  })

  if (recipientEmail) {
    const result = await sendPunchCardConfirmation({
      to: recipientEmail,
      cardUrl: `${await siteOrigin()}/card/${token}`,
      entries: totalPunches,
    })
    if (!result.sent)
      console.error("punch card confirmation email:", result.error)
  }

  return OK
}

const cardActionSchema = z.object({
  slug: z.string().min(1),
  cardId: z.uuid(),
})

export async function punchCard(
  input: z.input<typeof cardActionSchema>
): Promise<ActionResult> {
  const { user, location } = await requireLocationAccess(
    input.slug,
    "operations"
  )

  const parsed = cardActionSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }

  const card = await db.query.punchCards.findFirst({
    where: eq(punchCards.id, parsed.data.cardId),
    with: { customer: true },
  })
  if (!card) return { ok: false, error: "notFound" }
  if (card.usedPunches >= card.totalPunches) {
    return { ok: false, error: "full" }
  }

  const punchedAt = new Date()
  const usedPunches = card.usedPunches + 1
  const completed = usedPunches >= card.totalPunches
  await db.batch([
    db
      .update(punchCards)
      .set({
        usedPunches,
        status: completed ? "completed" : "active",
      })
      .where(eq(punchCards.id, card.id)),
    db.insert(punchEvents).values({
      cardId: card.id,
      locationId: location.id,
      adminUserId: user.id,
      createdAt: punchedAt,
    }),
  ])

  const recipientEmail = card.customer.email
  if (recipientEmail) {
    const result = await sendPunchNotification({
      to: recipientEmail,
      cardUrl: `${await siteOrigin()}/card/${card.token}`,
      remaining: remainingPunches(card.totalPunches, usedPunches),
      total: card.totalPunches,
      locationName: pickLocale(location.name, defaultLocale),
      punchedAt: formatDateTime(punchedAt, defaultLocale),
      completed,
    })
    if (!result.sent) console.error("punch notification email:", result.error)
  }

  return OK
}

export async function undoLastPunch(
  input: z.input<typeof cardActionSchema>
): Promise<ActionResult> {
  await requireLocationAccess(input.slug, "operations")

  const parsed = cardActionSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }

  const card = await db.query.punchCards.findFirst({
    where: eq(punchCards.id, parsed.data.cardId),
  })
  if (!card || card.usedPunches <= 0) {
    return { ok: false, error: "nothingToUndo" }
  }

  const restore = db
    .update(punchCards)
    .set({ usedPunches: card.usedPunches - 1, status: "active" })
    .where(eq(punchCards.id, card.id))

  const lastEvent = await db.query.punchEvents.findFirst({
    where: eq(punchEvents.cardId, card.id),
    orderBy: [desc(punchEvents.createdAt)],
  })

  if (lastEvent) {
    await db.batch([
      restore,
      db.delete(punchEvents).where(eq(punchEvents.id, lastEvent.id)),
    ])
  } else {
    await restore
  }

  return OK
}

const updateCustomerSchema = z.object({
  slug: z.string().min(1),
  customerId: z.uuid(),
  fullName: z.string().trim().default(""),
  email: z.string().trim().default(""),
})

export async function updateCustomerDetails(
  input: z.input<typeof updateCustomerSchema>
): Promise<ActionResult> {
  await requireLocationAccess(input.slug, "operations")

  const parsed = updateCustomerSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }

  await db
    .update(customers)
    .set({
      fullName: parsed.data.fullName,
      email: parsed.data.email || null,
    })
    .where(eq(customers.id, parsed.data.customerId))

  return OK
}

const updateCardSchema = z.object({
  slug: z.string().min(1),
  cardId: z.uuid(),
  totalPunches: z.coerce.number().int().min(1).max(100),
  note: z.string().trim().default(""),
})

export async function updateCardDetails(
  input: z.input<typeof updateCardSchema>
): Promise<ActionResult> {
  await requireLocationAccess(input.slug, "operations")

  const parsed = updateCardSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }

  const card = await db.query.punchCards.findFirst({
    where: eq(punchCards.id, parsed.data.cardId),
  })
  if (!card) return { ok: false, error: "notFound" }

  const totalPunches = parsed.data.totalPunches
  const usedPunches = Math.min(card.usedPunches, totalPunches)
  await db
    .update(punchCards)
    .set({
      totalPunches,
      usedPunches,
      status: usedPunches >= totalPunches ? "completed" : "active",
      note: parsed.data.note || null,
    })
    .where(eq(punchCards.id, card.id))

  return OK
}

export async function deleteCard(
  input: z.input<typeof cardActionSchema>
): Promise<ActionResult> {
  await requireLocationAccess(input.slug, "operations")

  const parsed = cardActionSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }

  await db.delete(punchCards).where(eq(punchCards.id, parsed.data.cardId))

  return OK
}

export async function markCardPaid(
  input: z.input<typeof cardActionSchema>
): Promise<ActionResult> {
  await requireLocationAccess(input.slug, "operations")

  const parsed = cardActionSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }

  await db
    .update(punchCardOrders)
    .set({ status: "paid", paidAt: new Date() })
    .where(eq(punchCardOrders.cardId, parsed.data.cardId))

  return OK
}
