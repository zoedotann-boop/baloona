import "server-only"

import { cache } from "react"

import { db } from "@/lib/db"
import { paymeConfig } from "@/lib/env"

export function isPaymentConfigured(): boolean {
  return paymeConfig() !== null
}

export const isShopOpen = cache(async (): Promise<boolean> => {
  if (!isPaymentConfigured()) return false
  const settings = await db.query.shopSettings.findFirst({
    columns: { isOpen: true },
  })
  return settings?.isOpen ?? false
})
