import "server-only"

import { paymeConfig } from "@/lib/env"

import {
  parseSale,
  refundOutcome,
  SALE_TTL_SECONDS,
  type RefundOutcome,
  type SaleStatus,
} from "./sale"

const PRODUCTION_BASE = "https://live.payme.io/api"
const SANDBOX_BASE = "https://sandbox.payme.io/api"

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

  const data = await postJson("generate-sale", {
    seller_payme_id: config.sellerId,
    sale_price: toAgorot(input.amount),
    currency: "ILS",
    product_name: input.productName,
    transaction_id: input.transactionId,
    installments: 1,
    sale_payment_method: "multi",
    sale_expiry_seconds: SALE_TTL_SECONDS,
    language: "he",
    sale_callback_url: input.callbackUrl,
    sale_return_url: input.returnUrl,
    sale_send_notification: true,
    ...(input.buyer?.name ? { sale_name: input.buyer.name } : {}),
    ...(input.buyer?.email ? { sale_email: input.buyer.email } : {}),
    ...(input.buyer?.phone ? { sale_mobile: input.buyer.phone } : {}),
  })
  if (
    !data ||
    data.status_code !== 0 ||
    !data.sale_url ||
    !data.payme_sale_id
  ) {
    logFailure("generate-sale", data)
    return null
  }
  return { saleUrl: String(data.sale_url), saleId: String(data.payme_sale_id) }
}

export async function getSale(saleId: string): Promise<SaleStatus | null> {
  const config = paymeConfig()
  if (!config) return null

  const data = await postJson("get-sales", {
    seller_payme_id: config.sellerId,
    sale_payme_id: saleId,
  })
  if (!data || data.status_code !== 0) {
    logFailure("get-sales", data)
    return null
  }
  return parseSale(data.items, saleId)
}

export async function refundSale(saleId: string): Promise<RefundOutcome> {
  const config = paymeConfig()
  if (!config) return "rejected"

  const data = await postJson("refund-sale", {
    seller_payme_id: config.sellerId,
    payme_sale_id: saleId,
  })
  const outcome = refundOutcome(data)
  if (outcome !== "refunded") logFailure("refund-sale", data)
  return outcome
}

function toAgorot(shekels: number): number {
  return Math.round(shekels * 100)
}

function logFailure(path: string, data: Record<string, unknown> | null) {
  console.error(`PayMe ${path} failed:`, {
    status_code: data?.status_code,
    status_error_code: data?.status_error_code,
    status_error_details: data?.status_error_details,
  })
}

async function postJson(
  path: string,
  body: Record<string, unknown>
): Promise<Record<string, unknown> | null> {
  const base = paymeConfig()?.sandbox ? SANDBOX_BASE : PRODUCTION_BASE
  try {
    const response = await fetch(`${base}/${path}`, {
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
