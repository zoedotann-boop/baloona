import "server-only"

import { randomUUID } from "node:crypto"

import { and, eq, inArray, ne, sql } from "drizzle-orm"

import { db } from "@/lib/db"
import {
  customers,
  punchCardOrders,
  punchCards,
  type ShopOrderStatus,
} from "@/lib/db/schema"
import { sendPunchCardConfirmation } from "@/lib/email/punch-card-confirmation"
import { getSale, refundSale } from "@/lib/payme/client"
import {
  nextOrderStep,
  refundBlocker,
  shouldQueryPayMe,
  type RefundBlocker,
} from "@/lib/shop/order-lifecycle"
import { siteOrigin } from "@/lib/site-url"

type Order = typeof punchCardOrders.$inferSelect

export interface SettledOrder {
  status: ShopOrderStatus
  cardToken: string | null
}

export async function settleOrder(
  orderId: string
): Promise<SettledOrder | null> {
  const order = await db.query.punchCardOrders.findFirst({
    where: eq(punchCardOrders.id, orderId),
  })
  if (!order) return null

  if (order.paymeSaleId && shouldQueryPayMe(order.status)) {
    const sale = await getSale(order.paymeSaleId)
    const step = nextOrderStep(order, sale, new Date())
    if (step === "issue") await issueCardForOrder(order)
    if (step === "refund") await markOrderRefunded(order)
    if (step === "expire") await expireOrder(order)
  }

  return readSettledOrder(orderId)
}

async function readSettledOrder(orderId: string): Promise<SettledOrder> {
  const order = await db.query.punchCardOrders.findFirst({
    where: eq(punchCardOrders.id, orderId),
    columns: { status: true },
    with: { card: { columns: { token: true } } },
  })
  return {
    status: order?.status ?? "failed",
    cardToken: order?.card?.token ?? null,
  }
}

async function issueCardForOrder(order: Order): Promise<void> {
  const cardId = order.id
  const [, issued] = await db.batch([
    db
      .insert(customers)
      .values({
        phone: order.phone,
        fullName: order.fullName,
        email: order.email || null,
      })
      .onConflictDoNothing({ target: customers.phone }),
    db
      .insert(punchCards)
      .values({
        id: cardId,
        token: randomUUID(),
        customerId: sql`(select ${customers.id} from ${customers} where ${customers.phone} = ${order.phone})`,
        totalPunches: order.entries,
        usedPunches: 0,
        status: "active",
        issuedByLocationId: order.fromLocationId,
      })
      .onConflictDoNothing({ target: punchCards.id })
      .returning({ token: punchCards.token }),
    db
      .update(punchCardOrders)
      .set({ status: "paid", paidAt: new Date(), cardId })
      .where(
        and(
          eq(punchCardOrders.id, order.id),
          inArray(punchCardOrders.status, ["pending", "expired"])
        )
      ),
  ])

  const token = issued[0]?.token
  if (!token || !order.email) return

  const result = await sendPunchCardConfirmation({
    to: order.email,
    cardUrl: `${await siteOrigin()}/card/${token}`,
    entries: order.entries,
  })
  if (!result.sent)
    console.error("punch card confirmation email:", result.error)
}

async function markOrderRefunded(order: Order): Promise<void> {
  const refundOrder = db
    .update(punchCardOrders)
    .set({ status: "refunded", refundedAt: new Date() })
    .where(
      and(
        eq(punchCardOrders.id, order.id),
        ne(punchCardOrders.status, "refunded")
      )
    )

  if (!order.cardId) {
    await refundOrder
    return
  }

  await db.batch([
    refundOrder,
    db
      .update(punchCards)
      .set({ status: "cancelled" })
      .where(eq(punchCards.id, order.cardId)),
  ])
}

async function expireOrder(order: Order): Promise<void> {
  await db
    .update(punchCardOrders)
    .set({ status: "expired" })
    .where(
      and(
        eq(punchCardOrders.id, order.id),
        eq(punchCardOrders.status, "pending")
      )
    )
}

export type RefundResult =
  | { ok: true }
  | { ok: false; error: RefundBlocker | "notFound" | "rejected" | "unknown" }

export async function refundOrder(orderId: string): Promise<RefundResult> {
  const order = await db.query.punchCardOrders.findFirst({
    where: eq(punchCardOrders.id, orderId),
    with: { card: { columns: { usedPunches: true, status: true } } },
  })
  if (!order) return { ok: false, error: "notFound" }

  const blocker = refundBlocker(order, order.card)
  if (blocker || !order.paymeSaleId) {
    return { ok: false, error: blocker ?? "notRefundable" }
  }

  const outcome = await refundSale(order.paymeSaleId)
  if (outcome !== "refunded") return { ok: false, error: outcome }

  await markOrderRefunded(order)
  return { ok: true }
}
