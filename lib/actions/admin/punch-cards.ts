"use server"

import { randomUUID } from "node:crypto"

import { desc, eq } from "drizzle-orm"
import { getLocale } from "next-intl/server"
import { z } from "zod"

import { type Locale } from "@/i18n/routing"
import { requireLocationAccess } from "@/lib/admin/access"
import { db } from "@/lib/db"
import { searchCustomerCards } from "@/lib/db/queries/admin"
import { customers, punchCards, punchEvents } from "@/lib/db/schema"
import { pickLocale } from "@/lib/localized"
import { type CustomerCardsView } from "@/lib/punch-cards"

import { OK, type ActionResult } from "./shared"

/**
 * כרטיסיות — the front-desk loyalty programme.
 *
 * Punch cards are brand-global (a customer redeems at any branch), but every
 * action still goes through `requireLocationAccess(slug)`: it is the house auth
 * gate *and* it tells us which branch the acting clerk is working from, which we
 * record on each punch for the multi-branch audit trail.
 */

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
    })),
  }))
}

const searchSchema = z.object({
  slug: z.string().min(1),
  query: z.string().optional(),
})

/** Find customers + cards by phone / email / name (blank query = most recent). */
export async function searchPunchCards(
  input: z.input<typeof searchSchema>
): Promise<CustomerCardsView[]> {
  await requireLocationAccess(input.slug)

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

/**
 * Issue a card to a customer (upserting them by phone). A fresh card sets
 * `remainingPunches === totalPunches`; migrating a physical card sets it lower,
 * so `usedPunches` reflects the punches the paper card already had.
 */
export async function issuePunchCard(
  input: z.input<typeof issueSchema>
): Promise<ActionResult> {
  const { location } = await requireLocationAccess(input.slug)

  const parsed = issueSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }
  const { phone, fullName, email, note, totalPunches, remainingPunches } =
    parsed.data

  const existing = await db.query.customers.findFirst({
    where: eq(customers.phone, phone),
  })

  let customerId: string
  if (existing) {
    customerId = existing.id
    // Backfill contact details the customer didn't have yet, never overwrite.
    const patch: Partial<typeof customers.$inferInsert> = {}
    if (fullName && !existing.fullName) patch.fullName = fullName
    if (email && !existing.email) patch.email = email
    if (Object.keys(patch).length > 0) {
      await db.update(customers).set(patch).where(eq(customers.id, customerId))
    }
  } else {
    const [created] = await db
      .insert(customers)
      .values({ phone, fullName, email: email || null })
      .returning({ id: customers.id })
    customerId = created.id
  }

  const usedPunches = totalPunches - remainingPunches
  await db.insert(punchCards).values({
    token: randomUUID(),
    customerId,
    totalPunches,
    usedPunches,
    status: usedPunches >= totalPunches ? "completed" : "active",
    issuedByLocationId: location.id,
    note: note || null,
  })

  return OK
}

const cardActionSchema = z.object({
  slug: z.string().min(1),
  cardId: z.uuid(),
})

/** Redeem one punch, recording the acting branch + clerk for the audit trail. */
export async function punchCard(
  input: z.input<typeof cardActionSchema>
): Promise<ActionResult> {
  const { user, location } = await requireLocationAccess(input.slug)

  const parsed = cardActionSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }

  const card = await db.query.punchCards.findFirst({
    where: eq(punchCards.id, parsed.data.cardId),
  })
  if (!card) return { ok: false, error: "notFound" }
  if (card.usedPunches >= card.totalPunches) {
    return { ok: false, error: "full" }
  }

  const usedPunches = card.usedPunches + 1
  await db.batch([
    db
      .update(punchCards)
      .set({
        usedPunches,
        status: usedPunches >= card.totalPunches ? "completed" : "active",
      })
      .where(eq(punchCards.id, card.id)),
    db.insert(punchEvents).values({
      cardId: card.id,
      locationId: location.id,
      adminUserId: user.id,
    }),
  ])

  return OK
}

/** Undo the most recent punch (front-desk misclicks). */
export async function undoLastPunch(
  input: z.input<typeof cardActionSchema>
): Promise<ActionResult> {
  await requireLocationAccess(input.slug)

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

  // Migrated physical punches carry no event, so there may be nothing to remove.
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

/** Correct a customer's name / email (phone stays their key). */
export async function updateCustomerDetails(
  input: z.input<typeof updateCustomerSchema>
): Promise<ActionResult> {
  await requireLocationAccess(input.slug)

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

/** Adjust a card's size / note; used punches are clamped to the new total. */
export async function updateCardDetails(
  input: z.input<typeof updateCardSchema>
): Promise<ActionResult> {
  await requireLocationAccess(input.slug)

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

/** Delete a card entirely (its punch events cascade away). */
export async function deleteCard(
  input: z.input<typeof cardActionSchema>
): Promise<ActionResult> {
  await requireLocationAccess(input.slug)

  const parsed = cardActionSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }

  await db.delete(punchCards).where(eq(punchCards.id, parsed.data.cardId))

  return OK
}
