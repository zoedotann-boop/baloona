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

/**
 * Digital punch cards (the café loyalty programme).
 *
 * These tables deliberately break the "everything cascades from a location"
 * rule the content tables follow: a punch card belongs to the *brand*, not a
 * branch, so a customer earns and redeems punches at any branch and the balance
 * is one global number. The branch references here are audit trails — which
 * branch issued a card and which branch (and clerk) redeemed each punch — so
 * they are nullable and `set null` on delete: closing a branch must never erase
 * a customer's card or its history.
 *
 * There is no customer login on this site. A customer is identified by phone at
 * the front desk, and views their own card through an unguessable share token
 * ({@link punchCards.token}) — the QR/link the clerk hands them.
 */

/** `active` while punches remain; `completed` once the card is fully punched. */
export const punchCardStatus = pgEnum("punch_card_status", [
  "active",
  "completed",
])

export type PunchCardStatus = (typeof punchCardStatus.enumValues)[number]

/**
 * A loyalty customer, global to the brand. Phone is the canonical key — it is
 * what a clerk has in hand — with email optional and also searchable.
 */
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

/**
 * One punch card. `usedPunches` is the single source of truth for the balance;
 * `remaining = totalPunches - usedPunches` is computed on render, never stored.
 * Migrating a physical card is just issuing one with `usedPunches > 0`.
 */
export const punchCards = pgTable(
  "punch_card",
  {
    id: uuid().primaryKey().defaultRandom(),
    /** Unguessable share token for the customer's link/QR. */
    token: text().notNull().unique(),
    customerId: uuid()
      .notNull()
      .references(() => customers.id, { onDelete: "cascade" }),
    totalPunches: integer().notNull(),
    usedPunches: integer().notNull().default(0),
    status: punchCardStatus().notNull().default("active"),
    /** Audit: the branch that issued the card. */
    issuedByLocationId: uuid().references(() => locations.id, {
      onDelete: "set null",
    }),
    /** Free note, e.g. "המרת כרטיסייה פיזית". */
    note: text(),
    ...timestamps,
  },
  (table) => [index("punch_card_customer").on(table.customerId)]
)

/**
 * One redeemed punch — the multi-branch audit trail, and what "undo last punch"
 * removes. Migrated physical punches have no event, so they carry no history.
 */
export const punchEvents = pgTable(
  "punch_event",
  {
    id: uuid().primaryKey().defaultRandom(),
    cardId: uuid()
      .notNull()
      .references(() => punchCards.id, { onDelete: "cascade" }),
    /** Audit: the branch where the punch was redeemed. */
    locationId: uuid().references(() => locations.id, { onDelete: "set null" }),
    /** Audit: the clerk who redeemed it. */
    adminUserId: text().references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("punch_event_card_created_at").on(table.cardId, table.createdAt),
  ]
)
