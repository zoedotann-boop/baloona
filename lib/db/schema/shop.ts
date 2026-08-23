import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

import { localized, timestamps } from "./_shared"
import { locations } from "./locations"
import { punchCards } from "./punch-cards"

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

/** `pending` until PayMe confirms payment; then `paid` (or `failed`). */
export const shopOrderStatus = pgEnum("shop_order_status", [
  "pending",
  "paid",
  "failed",
])

export type ShopOrderStatus = (typeof shopOrderStatus.enumValues)[number]

/**
 * One online punch-card purchase, pending until PayMe confirms payment.
 *
 * The card is issued only on a verified `paid` order (see `fulfilPunchCardOrder`
 * in `lib/actions/shop.ts`), so this row is the bridge between "buyer submitted
 * checkout" and "card exists". Product `entries`/`amount` are snapshotted so the
 * order stays self-contained even if the catalog changes, mirroring how a lead
 * snapshots its upgrade prices. `cardId` is set on fulfilment, which makes a
 * repeated PayMe callback idempotent — a second notification finds the card
 * already issued and does nothing.
 */
export const punchCardOrders = pgTable("punch_card_order", {
  id: uuid().primaryKey().defaultRandom(),
  productId: uuid().references(() => products.id, { onDelete: "set null" }),
  /** Buyer details; the `customer` row is upserted on fulfilment. */
  fullName: text().notNull().default(""),
  phone: text().notNull(),
  email: text().notNull().default(""),
  /** Branch the visitor bought from, recorded as the card's issuing branch. */
  fromLocationId: uuid().references(() => locations.id, {
    onDelete: "set null",
  }),
  /** Punches granted, snapshotted from the product at checkout. */
  entries: integer().notNull(),
  /** Whole shekels, snapshotted from the product at checkout. */
  amount: integer().notNull(),
  status: shopOrderStatus().notNull().default("pending"),
  /** PayMe's sale id, for matching and re-querying the callback. */
  paymeSaleId: text(),
  /** The issued card once paid — its presence marks the order fulfilled. */
  cardId: uuid().references(() => punchCards.id, { onDelete: "set null" }),
  paidAt: timestamp({ withTimezone: true }),
  ...timestamps,
})
