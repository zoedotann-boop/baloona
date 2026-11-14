"use server"

import { eq, inArray } from "drizzle-orm"
import { z } from "zod"

import { requireLocationAccess } from "@/lib/admin/access"
import { db } from "@/lib/db"
import {
  products,
  punchCardTheme,
  SHOP_SETTINGS_ID,
  shopSettings,
} from "@/lib/db/schema"

import {
  localizedSchema,
  OK,
  rowIdSchema,
  syncCollection,
  type ActionResult,
} from "./shared"

const shopSchema = z.object({
  slug: z.string().min(1),
  isOpen: z.boolean(),
  products: z.array(
    z.object({
      id: rowIdSchema,
      name: localizedSchema,
      entries: z.number().int().min(1),
      price: z.number().int().min(0),
      theme: z.enum(punchCardTheme.enumValues),
      isActive: z.boolean(),
      isFeatured: z.boolean(),
    })
  ),
})

export async function saveShop(
  input: z.input<typeof shopSchema>
): Promise<ActionResult> {
  await requireLocationAccess(input.slug, "content")

  const parsed = shopSchema.safeParse(input)
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

  await db
    .insert(shopSettings)
    .values({ id: SHOP_SETTINGS_ID, isOpen: parsed.data.isOpen })
    .onConflictDoUpdate({
      target: shopSettings.id,
      set: { isOpen: parsed.data.isOpen },
    })

  return OK
}
