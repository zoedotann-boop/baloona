import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

import { timestamps } from "./_shared"
import { locations } from "./locations"

export const leadKind = pgEnum("lead_kind", ["birthday", "contact"])

export type LeadKind = (typeof leadKind.enumValues)[number]

export const leadStatus = pgEnum("lead_status", [
  "new",
  "in_progress",
  "done",
  "archived",
])

export type LeadStatus = (typeof leadStatus.enumValues)[number]

export interface LeadUpgrade {
  label: string
  amount: number
}

export const leads = pgTable(
  "lead",
  {
    id: uuid().primaryKey().defaultRandom(),
    locationId: uuid()
      .notNull()
      .references(() => locations.id, { onDelete: "cascade" }),
    kind: leadKind().notNull(),
    status: leadStatus().notNull().default("new"),

    fullName: text().notNull().default(""),
    phone: text().notNull().default(""),
    email: text().notNull().default(""),

    subject: text(),
    message: text(),

    formData: jsonb().$type<Record<string, string>>().notNull().default({}),
    selectedUpgrades: jsonb().$type<LeadUpgrade[]>().notNull().default([]),
    totalAmount: integer(),
    signatureUrl: text(),
    consentAcceptedAt: timestamp({ withTimezone: true }),

    notifiedAt: timestamp({ withTimezone: true }),
    notifyError: text(),

    ...timestamps,
  },
  (table) => [
    index("lead_location_created_at").on(table.locationId, table.createdAt),
  ]
)
