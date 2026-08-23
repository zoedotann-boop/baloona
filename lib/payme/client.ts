import "server-only"

import { paymeConfig } from "@/lib/env"

/**
 * PayMe (PayMeService) server-side client.
 *
 * We use the `generate-sale` API: each checkout POSTs the order to PayMe, which
 * returns a one-off hosted payment page (`sale_url`) we redirect the buyer to.
 * When the sale is paid PayMe POSTs a server-to-server notification to our
 * `sale_callback_url`; we never trust that body on its own — {@link getSale}
 * re-queries PayMe to confirm the sale is really `completed` before we fulfil.
 *
 * Prices cross the wire in agorot (minor units): 100 = 1 ₪. Everywhere else in
 * this codebase prices are whole shekels, so the conversion lives here.
 *
 * Auth is by `seller_payme_id` in the request body — there is no header token
 * and (on a single-merchant account) no client secret, which is why callback
 * authenticity is established by re-query rather than a signature.
 */

const PRODUCTION_BASE = "https://ng.paymeservice.com"
const SANDBOX_BASE = "https://preprod.paymeservice.com"

function baseUrl(sandbox: boolean): string {
  return sandbox ? SANDBOX_BASE : PRODUCTION_BASE
}

export interface GenerateSaleInput {
  /** Amount in whole shekels; converted to agorot for PayMe. */
  amount: number
  /** Description shown on the payment page. */
  productName: string
  /** Our order/lead id, echoed back on the callback for correlation. */
  transactionId: string
  /** Server-to-server notification URL PayMe POSTs the paid sale to. */
  callbackUrl: string
  /** Where PayMe redirects the buyer's browser after a successful payment. */
  returnUrl: string
  buyer?: { name?: string; email?: string; phone?: string }
}

export interface GeneratedSale {
  /** Hosted payment page to redirect the buyer to. */
  saleUrl: string
  /** PayMe's sale id, persisted so the callback can be matched and re-queried. */
  saleId: string
}

/**
 * Create a hosted sale. Returns `null` when payments are unconfigured or PayMe
 * rejects the request, so callers degrade to their no-payment path instead of
 * throwing at the visitor.
 */
export async function generateSale(
  input: GenerateSaleInput
): Promise<GeneratedSale | null> {
  const config = paymeConfig()
  if (!config) return null

  const body = {
    seller_payme_id: config.sellerId,
    sale_price: toAgorot(input.amount),
    currency: "ILS",
    product_name: input.productName,
    transaction_id: input.transactionId,
    installments: 1,
    language: "he",
    sale_callback_url: input.callbackUrl,
    sale_return_url: input.returnUrl,
    sale_send_notification: true,
    ...(input.buyer?.name ? { sale_name: input.buyer.name } : {}),
    ...(input.buyer?.email ? { sale_email: input.buyer.email } : {}),
    ...(input.buyer?.phone ? { sale_mobile: input.buyer.phone } : {}),
  }

  const data = await postJson(config.sandbox, "generate-sale", body)
  if (
    !data ||
    data.status_code !== 0 ||
    !data.sale_url ||
    !data.payme_sale_id
  ) {
    console.error("PayMe generate-sale failed:", {
      env: config.sandbox ? "sandbox" : "production",
      status_code: data?.status_code,
      status_error_code: data?.status_error_code,
      status_error_details: data?.status_error_details,
      status_additional_info: data?.status_additional_info,
    })
    return null
  }
  return { saleUrl: String(data.sale_url), saleId: String(data.payme_sale_id) }
}

export interface SaleStatus {
  /** PayMe sale status, e.g. `completed`, `initial`, `failed`, `refunded`. */
  status: string
  /** Amount PayMe actually recorded, in whole shekels (rounded from agorot). */
  amount: number
}

/**
 * Re-query a sale by its PayMe id to confirm it was really paid. This is the
 * authoritative check the callback relies on: a browser-forged notification for
 * an unpaid sale never passes it. Returns `null` if the sale can't be found or
 * the query fails, so callers fail closed (do not fulfil).
 */
export async function getSale(saleId: string): Promise<SaleStatus | null> {
  const config = paymeConfig()
  if (!config) return null

  const data = await postJson(config.sandbox, "get-sales", {
    seller_payme_id: config.sellerId,
    sale_payme_id: saleId,
  })
  if (!data || data.status_code !== 0) return null

  // get-sales returns a collection; take the row matching this sale id.
  const rows: Record<string, unknown>[] = Array.isArray(data.items)
    ? data.items
    : Array.isArray(data.sales)
      ? data.sales
      : []
  const sale = rows.find(
    (row) => row.payme_sale_id === saleId || row.sale_payme_id === saleId
  )
  if (!sale) return null

  const status = sale.sale_status
  const price = sale.price
  if (typeof status !== "string" || typeof price !== "number") return null
  return { status, amount: Math.round(price / 100) }
}

function toAgorot(shekels: number): number {
  return Math.round(shekels * 100)
}

async function postJson(
  sandbox: boolean,
  path: string,
  body: unknown
): Promise<Record<string, unknown> | null> {
  try {
    const response = await fetch(`${baseUrl(sandbox)}/api/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    })
    // PayMe returns its error details in the JSON body even on HTTP 500, so parse
    // the body regardless of status and let callers read `status_code`. Only a
    // non-JSON response (a genuine outage) is unrecoverable.
    const text = await response.text()
    try {
      return JSON.parse(text) as Record<string, unknown>
    } catch {
      console.error(
        `PayMe ${path} HTTP ${response.status}:`,
        text.slice(0, 500)
      )
      return null
    }
  } catch (error) {
    console.error(`PayMe ${path} request failed:`, error)
    return null
  }
}
