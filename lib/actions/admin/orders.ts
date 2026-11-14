"use server"

import { z } from "zod"

import { requireLocationAccess } from "@/lib/admin/access"
import type { ShopOrderStatus } from "@/lib/db/schema"
import { refundOrder, settleOrder } from "@/lib/shop/orders"

import { OK, type ActionResult } from "./shared"

const orderActionSchema = z.object({
  slug: z.string().min(1),
  orderId: z.uuid(),
})

export async function recheckOrder(
  input: z.input<typeof orderActionSchema>
): Promise<
  { ok: true; status: ShopOrderStatus } | { ok: false; error: string }
> {
  await requireLocationAccess(input.slug, "payments")

  const parsed = orderActionSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }

  const settled = await settleOrder(parsed.data.orderId)
  if (!settled) return { ok: false, error: "notFound" }
  return { ok: true, status: settled.status }
}

export async function refundPunchCardOrder(
  input: z.input<typeof orderActionSchema>
): Promise<ActionResult> {
  await requireLocationAccess(input.slug, "payments")

  const parsed = orderActionSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }

  const result = await refundOrder(parsed.data.orderId)
  return result.ok ? OK : result
}
