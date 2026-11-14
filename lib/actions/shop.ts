"use server"

import { and, eq } from "drizzle-orm"
import { z } from "zod"

import { defaultLocale } from "@/i18n/routing"
import { db } from "@/lib/db"
import { locations, products, punchCardOrders } from "@/lib/db/schema"
import { isHoneypotFilled } from "@/lib/forms/honeypot"
import { checkoutSchema } from "@/lib/forms/schemas"
import { pickLocale } from "@/lib/localized"
import { generateSale } from "@/lib/payme/client"
import { isShopOpen } from "@/lib/shop/availability"
import { scheduleOrderCheck } from "@/lib/shop/order-queue"
import { siteOrigin } from "@/lib/site-url"

type CheckoutResult =
  { ok: true; redirect: string } | { ok: false; error: string }

// react-doctor-disable-next-line react-doctor/server-auth-actions -- public checkout
export async function startPunchCardCheckout(
  input: z.input<typeof checkoutSchema>
): Promise<CheckoutResult> {
  if (!isShopOpen()) return { ok: false, error: "invalid" }
  const parsed = checkoutSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }
  if (isHoneypotFilled(parsed.data.honeypot))
    return { ok: false, error: "invalid" }
  const { productId, fullName, phone, email, from } = parsed.data

  const product = await db.query.products.findFirst({
    where: and(eq(products.id, productId), eq(products.isActive, true)),
  })
  if (!product) return { ok: false, error: "invalid" }

  const branch = from
    ? await db.query.locations.findFirst({
        where: eq(locations.slug, from),
        columns: { id: true },
      })
    : null

  const [order] = await db
    .insert(punchCardOrders)
    .values({
      productId: product.id,
      fullName,
      phone,
      email,
      fromLocationId: branch?.id ?? null,
      entries: product.entries,
      amount: product.price,
    })
    .returning({ id: punchCardOrders.id })

  const origin = await siteOrigin()
  const returnQuery = from ? `&from=${encodeURIComponent(from)}` : ""
  const sale = await generateSale({
    amount: product.price,
    productName: pickLocale(product.name, defaultLocale),
    transactionId: `order:${order.id}`,
    callbackUrl: `${origin}/api/payme`,
    returnUrl: `${origin}/checkout/success?order=${order.id}${returnQuery}`,
    buyer: { name: fullName, email, phone },
  })

  if (!sale) {
    await db
      .update(punchCardOrders)
      .set({ status: "failed" })
      .where(eq(punchCardOrders.id, order.id))
    return { ok: false, error: "payment" }
  }

  await db
    .update(punchCardOrders)
    .set({ paymeSaleId: sale.saleId })
    .where(eq(punchCardOrders.id, order.id))
  await scheduleOrderCheck(order.id)

  return { ok: true, redirect: sale.saleUrl }
}
