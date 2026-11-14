import { SALE_TTL_SECONDS, type SaleStatus } from "@/lib/payme/sale"
import type { PunchCardStatus, ShopOrderStatus } from "@/lib/db/schema"

const EXPIRY_GRACE_SECONDS = 60 * 60

export const ORDER_TTL_MS = (SALE_TTL_SECONDS + EXPIRY_GRACE_SECONDS) * 1000

export type OrderStep = "issue" | "refund" | "expire" | "none"

interface SettleableOrder {
  status: ShopOrderStatus
  amount: number
  createdAt: Date
}

export function nextOrderStep(
  order: SettleableOrder,
  sale: SaleStatus | null,
  now: Date
): OrderStep {
  if (order.status === "failed" || order.status === "refunded") return "none"

  if (sale?.status === "refunded") return "refund"

  const awaitingPayment =
    order.status === "pending" || order.status === "expired"
  if (awaitingPayment && sale?.status === "completed") {
    return sale.amount === order.amount ? "issue" : "none"
  }

  const pastTtl = now.getTime() - order.createdAt.getTime() > ORDER_TTL_MS
  return order.status === "pending" && pastTtl ? "expire" : "none"
}

export function shouldQueryPayMe(status: ShopOrderStatus): boolean {
  return status === "pending" || status === "expired" || status === "paid"
}

export type RefundBlocker = "notRefundable" | "cardUsed"

export function refundBlocker(
  order: { status: ShopOrderStatus; paymeSaleId: string | null },
  card: { usedPunches: number; status: PunchCardStatus } | null
): RefundBlocker | null {
  if (
    order.status !== "paid" ||
    !order.paymeSaleId ||
    card?.status === "cancelled"
  ) {
    return "notRefundable"
  }
  return card && card.usedPunches > 0 ? "cardUsed" : null
}
