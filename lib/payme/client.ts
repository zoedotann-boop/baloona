import "server-only"

import { paymeConfig } from "@/lib/env"

const PRODUCTION_BASE = "https://ng.paymeservice.com"
const SANDBOX_BASE = "https://preprod.paymeservice.com"

function baseUrl(sandbox: boolean): string {
  return sandbox ? SANDBOX_BASE : PRODUCTION_BASE
}

export interface GenerateSaleInput {
  amount: number
  productName: string
  transactionId: string
  callbackUrl: string
  returnUrl: string
  buyer?: { name?: string; email?: string; phone?: string }
}

export interface GeneratedSale {
  saleUrl: string
  saleId: string
}

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
  status: string
  amount: number
}

export async function getSale(saleId: string): Promise<SaleStatus | null> {
  const config = paymeConfig()
  if (!config) return null

  const data = await postJson(config.sandbox, "get-sales", {
    seller_payme_id: config.sellerId,
    sale_payme_id: saleId,
  })
  if (!data || data.status_code !== 0) return null

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
