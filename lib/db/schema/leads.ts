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

/** An upgrade as chosen at submission time, priced as it was on that day. */
export interface LeadUpgrade {
  label: string
  amount: number
}

/**
 * A form submission — a birthday booking request or a contact message.
 *
 * Contact details that every lead has get real columns so the inbox can list,
 * search and sort them. Everything the editor added to the booking form lands
 * in `formData` as `key → answer` and is rendered as a plain key/value list in
 * the admin, which keeps the form editable without a migration per question.
 */
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

    /** Contact form only: the chosen subject chip and the message body. */
    subject: text(),
    message: text(),

    /** Birthday form only: answers to the location's configured questions. */
    formData: jsonb().$type<Record<string, string>>().notNull().default({}),
    selectedUpgrades: jsonb().$type<LeadUpgrade[]>().notNull().default([]),
    /** Package + upgrades at submission time, in whole shekels. */
    totalAmount: integer(),
    signatureUrl: text(),
    consentAcceptedAt: timestamp({ withTimezone: true }),

    /** Birthday form only: the PayMe sale id for the deposit, once one is
     * generated, and the moment PayMe confirmed it was paid. */
    depositSaleId: text(),
    depositPaidAt: timestamp({ withTimezone: true }),

    /** Set once the Resend notification goes out; holds the error otherwise. */
    notifiedAt: timestamp({ withTimezone: true }),
    notifyError: text(),

    ...timestamps,
  },
  (table) => [
    index("lead_location_created_at").on(table.locationId, table.createdAt),
  ]
)
