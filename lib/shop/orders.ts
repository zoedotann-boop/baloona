import "server-only"

import { randomUUID } from "node:crypto"

import { and, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { customers, punchCardOrders, punchCards } from "@/lib/db/schema"
import { getSale } from "@/lib/payme/client"

/**
 * Punch-card order fulfilment — the server-side half of the shop checkout.
 *
 * Kept out of the `"use server"` action module on purpose: only server code (the
 * PayMe callback and the success page) fulfils an order, so these must not be
 * exposed as callable actions. `startPunchCardCheckout` in `lib/actions/shop.ts`
 * borrows {@link issueCard} for its no-payment fallback.
 */

/** Upsert the customer by phone and issue a fresh card. */
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
    if (input.fullName && !existing.fullName) patch.fullName = input.fullName
    if (input.email && !existing.email) patch.email = input.email
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

/**
 * Confirm a punch-card order was paid and issue its card. Idempotent: a fulfilled
 * order returns its existing card token, so a repeated PayMe callback or a
 * success-page revisit does nothing. Payment is re-queried from PayMe here — the
 * order id alone never issues a card. Returns the card token, or `null` when the
 * order is unpaid/unverifiable.
 */
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

  // Claim the order atomically before issuing: only the caller that flips
  // `pending → paid` gets to create the card, so the PayMe callback and the
  // success page racing on the same order never issue it twice. (neon-http has
  // no interactive row locks, so a conditional UPDATE is the guard.)
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
    // Lost the race — the winner is issuing the card; return it if it's ready.
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

  return token
}

/** Look up a punch card's share token by id. */
async function tokenForCard(cardId: string): Promise<string | null> {
  const card = await db.query.punchCards.findFirst({
    where: eq(punchCards.id, cardId),
    columns: { token: true },
  })
  return card?.token ?? null
}
