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

export const products = pgTable("product", {
  id: uuid().primaryKey().defaultRandom(),
  name: localized().notNull(),
  entries: integer().notNull(),
  price: integer().notNull(),
  isActive: boolean().notNull().default(true),
  isFeatured: boolean().notNull().default(false),
  sortOrder: integer().notNull().default(0),
  ...timestamps,
})

export const shopOrderStatus = pgEnum("shop_order_status", [
  "pending",
  "paid",
  "failed",
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
  amount: integer().notNull(),
  status: shopOrderStatus().notNull().default("pending"),
  paymeSaleId: text(),
  cardId: uuid().references(() => punchCards.id, { onDelete: "set null" }),
  paidAt: timestamp({ withTimezone: true }),
  ...timestamps,
})
