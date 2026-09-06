import {
  boolean,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

import { locations } from "./locations"

/**
 * Better Auth core tables.
 *
 * The property names must stay camelCase: the Drizzle adapter resolves columns
 * by Better Auth's own field names (`emailVerified`, `userId`, …). The physical
 * column names are snake_cased by the `casing` option on the Drizzle client.
 */

/**
 * Admin roles, from most to least privileged. Each is a strict superset of the
 * one below it (see `lib/admin/permissions.ts`):
 * - `owner` manages every location and may create, delete and staff them.
 * - `manager` edits branch settings, leads and punch cards for the locations
 *   listed for it in `locationMembers`.
 * - `staff` (צוות בלונה) is a junior role limited to punch cards on those same
 *   locations.
 */
export const userRole = pgEnum("user_role", ["owner", "manager", "staff"])

export type UserRole = (typeof userRole.enumValues)[number]

export const users = pgTable("user", {
  id: text().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().notNull().default(false),
  image: text(),
  role: userRole().notNull().default("manager"),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})

export const sessions = pgTable("session", {
  id: text().primaryKey(),
  token: text().notNull().unique(),
  expiresAt: timestamp({ withTimezone: true }).notNull(),
  ipAddress: text(),
  userAgent: text(),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})

export const accounts = pgTable("account", {
  id: text().primaryKey(),
  accountId: text().notNull(),
  providerId: text().notNull(),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text(),
  refreshToken: text(),
  idToken: text(),
  accessTokenExpiresAt: timestamp({ withTimezone: true }),
  refreshTokenExpiresAt: timestamp({ withTimezone: true }),
  scope: text(),
  password: text(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})

export const verifications = pgTable("verification", {
  id: text().primaryKey(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp({ withTimezone: true }).notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})

/**
 * Which locations a `manager` or `staff` member is scoped to. Owners bypass this
 * table entirely.
 */
export const locationMembers = pgTable(
  "location_member",
  {
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    locationId: uuid()
      .notNull()
      .references(() => locations.id, { onDelete: "cascade" }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.locationId] })]
)
