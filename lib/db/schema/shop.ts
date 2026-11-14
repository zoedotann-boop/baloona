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
import { punchCards, punchCardTheme } from "./punch-cards"

export const products = pgTable("product", {
  id: uuid().primaryKey().defaultRandom(),
  name: localized().notNull(),
  entries: integer().notNull(),
  price: integer().notNull(),
  theme: punchCardTheme().notNull().default("age12"),
  isActive: boolean().notNull().default(true),
  isFeatured: boolean().notNull().default(false),
  sortOrder: integer().notNull().default(0),
  ...timestamps,
})

export const shopSettings = pgTable("shop_setting", {
  id: integer().primaryKey().default(1),
  isOpen: boolean().notNull().default(false),
  ...timestamps,
})

export const SHOP_SETTINGS_ID = 1

export const shopOrderStatus = pgEnum("shop_order_status", [
  "pending",
  "paid",
  "failed",
  "expired",
  "refunded",
])

export type ShopOrderStatus = (typeof shopOrderStatus.enumValues)[number]

export const punchCardOrders = pgTable("punch_card_order", {
  id: uuid().primaryKey().defaultRandom(),
  productId: uuid().references(() => products.id, { onDelete: "set null" }),
  fullName: text().notNull().default(""),
  phone: text().notNull(),
  email: text().notNull().default(""),
  fromLocationId: uuid().references(() => locations.id, {
    onDelete: "set null",
  }),
  entries: integer().notNull(),
  theme: punchCardTheme().notNull().default("age12"),
  amount: integer().notNull(),
  status: shopOrderStatus().notNull().default("pending"),
  paymeSaleId: text(),
  cardId: uuid().references(() => punchCards.id, { onDelete: "set null" }),
  paidAt: timestamp({ withTimezone: true }),
  refundedAt: timestamp({ withTimezone: true }),
  ...timestamps,
})
