import { boolean, integer, pgTable, uuid } from "drizzle-orm/pg-core"

import { localized, timestamps } from "./_shared"

/**
 * The shop catalog: digital punch-card packages sold online.
 *
 * Like the punch cards themselves, a product is **brand-global** — the same
 * packages are offered across every branch — so this table does not cascade
 * from a location. `entries` is the number of punches a package grants, which is
 * what a purchase sets as `punch_card.totalPunches` (see `purchasePunchCard` in
 * `lib/actions/shop.ts`). Prices are whole shekels.
 */
export const products = pgTable("product", {
  id: uuid().primaryKey().defaultRandom(),
  name: localized().notNull(),
  /** Punches the package grants, e.g. 10 or 20. */
  entries: integer().notNull(),
  /** Whole shekels; currency is added on render via `formatPrice`. */
  price: integer().notNull(),
  /** Only active products are shown in the shop. */
  isActive: boolean().notNull().default(true),
  /** Highlighted as the "popular choice" with a badge. */
  isFeatured: boolean().notNull().default(false),
  sortOrder: integer().notNull().default(0),
  ...timestamps,
})
