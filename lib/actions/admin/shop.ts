"use server"

import { eq, inArray } from "drizzle-orm"
import { z } from "zod"

import { requireLocationAccess } from "@/lib/admin/access"
import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"

import {
  localizedSchema,
  OK,
  rowIdSchema,
  syncCollection,
  type ActionResult,
} from "./shared"

/**
 * חנות — the shop catalog editor.
 *
 * Products are brand-global, so this is not scoped to a location; the `slug`
 * only re-checks admin access via `requireLocationAccess` (the house auth gate),
 * exactly like the punch-card actions. The whole list is submitted at once and
 * reconciled with `syncCollection`, mirroring `savePricing`.
 */

const productsSchema = z.object({
  slug: z.string().min(1),
  products: z.array(
    z.object({
      id: rowIdSchema,
      name: localizedSchema,
      entries: z.number().int().min(1),
      price: z.number().int().min(0),
      isActive: z.boolean(),
      isFeatured: z.boolean(),
    })
  ),
})

export async function saveProducts(
  input: z.input<typeof productsSchema>
): Promise<ActionResult> {
  await requireLocationAccess(input.slug)

  const parsed = productsSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }

  const existing = await db.query.products.findMany({ columns: { id: true } })

  await syncCollection({
    existingIds: existing.map((product) => product.id),
    incoming: parsed.data.products.map((product, sortOrder) => ({
      ...product,
      sortOrder,
    })),
    insert: (rows) => db.insert(products).values(rows),
    update: (row) =>
      db.update(products).set(row).where(eq(products.id, row.id)),
    remove: (ids) => db.delete(products).where(inArray(products.id, ids)),
  })

  return OK
}
