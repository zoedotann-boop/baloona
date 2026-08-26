"use server"

import { and, eq } from "drizzle-orm"
import { z } from "zod"

import { defaultLocale } from "@/i18n/routing"
import { db } from "@/lib/db"
import { locations, products, punchCardOrders } from "@/lib/db/schema"
import { paymeConfig } from "@/lib/env"
import { isHoneypotFilled } from "@/lib/forms/honeypot"
import { checkoutSchema } from "@/lib/forms/schemas"
import { pickLocale } from "@/lib/localized"
import { generateSale } from "@/lib/payme/client"
import { issueCard } from "@/lib/shop/orders"
import { siteOrigin } from "@/lib/site-url"

/**
 * `redirect` — payments on: go pay at PayMe, the card is issued on confirmation.
 * `token` — payments off: the card was issued immediately (dev/no-key fallback).
 */
type CheckoutResult =
  | { ok: true; redirect: string }
  | { ok: true; token: string }
  | { ok: false; error: string }

// Deliberately unauthenticated: it backs the public checkout. With PayMe
// configured it creates a pending order and hands back a hosted payment page —
// the card is only issued once payment is confirmed (see `fulfilOrder`, reached
// from the PayMe callback and the success page). Without a PayMe key it falls
// back to issuing the card immediately so the shop still works in dev.
// react-doctor-disable-next-line react-doctor/server-auth-actions -- public checkout
export async function startPunchCardCheckout(
  input: z.input<typeof checkoutSchema>
): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }
  // Drop bot submissions silently — the honeypot is invisible to humans.
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

  // No PayMe key: keep the pre-payment behaviour and issue the card at once.
  if (!paymeConfig()) {
    const { token } = await issueCard({
      entries: product.entries,
      fullName,
      phone,
      email,
      fromLocationId: branch?.id ?? null,
    })
    return { ok: true, token }
  }

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
  // Carry `from` back so the success page can wear the same branch chrome the
  // checkout did.
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

  return { ok: true, redirect: sale.saleUrl }
}
