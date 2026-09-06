import "server-only"

import { randomUUID } from "node:crypto"

import { and, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { customers, punchCardOrders, punchCards } from "@/lib/db/schema"
import { sendPunchCardConfirmation } from "@/lib/email/punch-card-confirmation"
import { getSale } from "@/lib/payme/client"
import { siteOrigin } from "@/lib/site-url"

export async function issueCard(input: {
  entries: number
  fullName: string
  phone: string
  email: string
  fromLocationId: string | null
}): Promise<{ token: string; cardId: string }> {
  const existing = await db.query.customers.findFirst({
    where: eq(customers.phone, input.phone),
  })

  let customerId: string
  if (existing) {
    customerId = existing.id
    const patch: Partial<typeof customers.$inferInsert> = {}
    if (input.fullName) patch.fullName = input.fullName
    if (input.email) patch.email = input.email
    if (Object.keys(patch).length > 0) {
      await db.update(customers).set(patch).where(eq(customers.id, customerId))
    }
  } else {
    const [created] = await db
      .insert(customers)
      .values({
        phone: input.phone,
        fullName: input.fullName,
        email: input.email || null,
      })
      .returning({ id: customers.id })
    customerId = created.id
  }

  const token = randomUUID()
  const [card] = await db
    .insert(punchCards)
    .values({
      token,
      customerId,
      totalPunches: input.entries,
      usedPunches: 0,
      status: "active",
      issuedByLocationId: input.fromLocationId,
    })
    .returning({ id: punchCards.id })
  return { token, cardId: card.id }
}

export async function fulfilOrder(orderId: string): Promise<string | null> {
  const order = await db.query.punchCardOrders.findFirst({
    where: eq(punchCardOrders.id, orderId),
  })
  if (!order) return null

  if (order.cardId) return tokenForCard(order.cardId)
  if (!order.paymeSaleId) return null

  const sale = await getSale(order.paymeSaleId)
  if (!sale || sale.status !== "completed" || sale.amount !== order.amount) {
    return null
  }

  const claimed = await db
    .update(punchCardOrders)
    .set({ status: "paid", paidAt: new Date() })
    .where(
      and(
        eq(punchCardOrders.id, order.id),
        eq(punchCardOrders.status, "pending")
      )
    )
    .returning({ id: punchCardOrders.id })
  if (claimed.length === 0) {
    const fresh = await db.query.punchCardOrders.findFirst({
      where: eq(punchCardOrders.id, order.id),
      columns: { cardId: true },
    })
    return fresh?.cardId ? tokenForCard(fresh.cardId) : null
  }

  const { token, cardId } = await issueCard({
    entries: order.entries,
    fullName: order.fullName,
    phone: order.phone,
    email: order.email,
    fromLocationId: order.fromLocationId,
  })
  await db
    .update(punchCardOrders)
    .set({ cardId })
    .where(eq(punchCardOrders.id, order.id))

  const result = await sendPunchCardConfirmation({
    to: order.email,
    cardUrl: `${await siteOrigin()}/card/${token}`,
    entries: order.entries,
  })
  if (!result.sent)
    console.error("punch card confirmation email:", result.error)

  return token
}

async function tokenForCard(cardId: string): Promise<string | null> {
  const card = await db.query.punchCards.findFirst({
    where: eq(punchCards.id, cardId),
    columns: { token: true },
  })
  return card?.token ?? null
}
