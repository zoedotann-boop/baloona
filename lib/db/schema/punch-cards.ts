import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

import { users } from "./auth"
import { locations } from "./locations"
import { timestamps } from "./_shared"

export const punchCardStatus = pgEnum("punch_card_status", [
  "active",
  "completed",
])

export type PunchCardStatus = (typeof punchCardStatus.enumValues)[number]

// Which brand art a card wears. `age12` is the red graphic (children above age
// two); `age2` is the blue one (children under two). Mirrors the presentational
// `PunchCardTheme` union in `components/shop/punch-card-art.tsx`.
export const punchCardTheme = pgEnum("punch_card_theme", ["age12", "age2"])

export type PunchCardTheme = (typeof punchCardTheme.enumValues)[number]

export const customers = pgTable(
  "customer",
  {
    id: uuid().primaryKey().defaultRandom(),
    fullName: text().notNull().default(""),
    phone: text().notNull().unique(),
    email: text(),
    ...timestamps,
  },
  (table) => [index("customer_email").on(table.email)]
)

export const punchCards = pgTable(
  "punch_card",
  {
    id: uuid().primaryKey().defaultRandom(),
    token: text().notNull().unique(),
    customerId: uuid()
      .notNull()
      .references(() => customers.id, { onDelete: "cascade" }),
    totalPunches: integer().notNull(),
    usedPunches: integer().notNull().default(0),
    status: punchCardStatus().notNull().default("active"),
    theme: punchCardTheme().notNull().default("age12"),
    issuedByLocationId: uuid().references(() => locations.id, {
      onDelete: "set null",
    }),
    note: text(),
    ...timestamps,
  },
  (table) => [index("punch_card_customer").on(table.customerId)]
)

export const punchEvents = pgTable(
  "punch_event",
  {
    id: uuid().primaryKey().defaultRandom(),
    cardId: uuid()
      .notNull()
      .references(() => punchCards.id, { onDelete: "cascade" }),
    locationId: uuid().references(() => locations.id, { onDelete: "set null" }),
    adminUserId: text().references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("punch_event_card_created_at").on(table.cardId, table.createdAt),
  ]
)
