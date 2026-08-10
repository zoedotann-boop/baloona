"use server"

import { randomUUID } from "node:crypto"

import { and, eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/lib/db"
import { customers, locations, products, punchCards } from "@/lib/db/schema"

type PurchaseResult = { ok: true; token: string } | { ok: false; error: string }

const schema = z.object({
  productId: z.uuid(),
  fullName: z.string().trim().default(""),
  phone: z.string().trim().min(6).max(40),
  email: z.string().trim().default(""),
  /** Branch the visitor bought from, recorded as the issuing branch. */
  from: z.string().optional(),
})

// Deliberately unauthenticated: it backs the public checkout. Until PayMe is
// connected a "purchase" simply issues the card so it lands in the front-desk
// console; once payment is live, gate this behind a verified sale. It only
// upserts a customer by phone and inserts a card for a validated active product.
// react-doctor-disable-next-line react-doctor/server-auth-actions -- public checkout
export async function purchasePunchCard(
  input: z.input<typeof schema>
): Promise<PurchaseResult> {
  const parsed = schema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }
  const { productId, fullName, phone, email, from } = parsed.data

  const product = await db.query.products.findFirst({
    where: and(eq(products.id, productId), eq(products.isActive, true)),
  })
  if (!product) return { ok: false, error: "invalid" }

  const existing = await db.query.customers.findFirst({
    where: eq(customers.phone, phone),
  })

  let customerId: string
  if (existing) {
    customerId = existing.id
    const patch: Partial<typeof customers.$inferInsert> = {}
    if (fullName && !existing.fullName) patch.fullName = fullName
    if (email && !existing.email) patch.email = email
    if (Object.keys(patch).length > 0) {
      await db.update(customers).set(patch).where(eq(customers.id, customerId))
    }
  } else {
    const [created] = await db
      .insert(customers)
      .values({ phone, fullName, email: email || null })
      .returning({ id: customers.id })
    customerId = created.id
  }

  const branch = from
    ? await db.query.locations.findFirst({
        where: eq(locations.slug, from),
        columns: { id: true },
      })
    : null

  const token = randomUUID()
  await db.insert(punchCards).values({
    token,
    customerId,
    totalPunches: product.entries,
    usedPunches: 0,
    status: "active",
    issuedByLocationId: branch?.id ?? null,
  })

  return { ok: true, token }
}
