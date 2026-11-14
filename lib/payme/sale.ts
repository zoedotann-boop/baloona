export const SALE_TTL_SECONDS = 24 * 60 * 60

export interface SaleStatus {
  status: string
  amount: number
}

export type RefundOutcome = "refunded" | "rejected" | "unknown"

const UNKNOWN_REFUND_CODES = new Set([998, 999, 991, 20002])

export function parseSale(items: unknown, saleId: string): SaleStatus | null {
  if (!Array.isArray(items)) return null
  const sale = items.find(
    (row): row is Record<string, unknown> =>
      typeof row === "object" &&
      row !== null &&
      (row.sale_payme_id === saleId || row.payme_sale_id === saleId)
  )
  if (!sale) return null

  const status = sale.sale_status
  const price = Number(sale.sale_price)
  if (typeof status !== "string" || !Number.isFinite(price)) return null
  return { status, amount: price / 100 }
}

export function refundOutcome(
  data: Record<string, unknown> | null
): RefundOutcome {
  if (!data) return "unknown"
  if (data.status_code === 0) return "refunded"
  const errorCode = Number(data.status_error_code)
  return UNKNOWN_REFUND_CODES.has(errorCode) ? "unknown" : "rejected"
}
