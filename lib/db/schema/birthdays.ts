import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"

import { type Localized, localized, localizedList, timestamps } from "./_shared"
import { locations } from "./locations"

export const birthdayContents = pgTable("birthday_content", {
  locationId: uuid()
    .primaryKey()
    .references(() => locations.id, { onDelete: "cascade" }),

  heroTitle: localized().notNull(),
  heroDescription: localized().notNull(),
  heroImageUrl: text(),

  stepsTitle: localized().notNull(),
  stepsNote: localized().notNull(),

  packageTitle: localized().notNull(),
  packageAmount: integer().notNull().default(0),
  packageChildrenCount: integer().notNull().default(25),
  extraChildAmount: integer().notNull().default(0),
  includedTitle: localized().notNull(),

  depositAmount: integer().notNull().default(0),
  depositNote: localized().notNull(),

  upgradesTitle: localized().notNull(),

  rulesTitle: localized().notNull(),
  rules: localizedList().notNull(),

  formTitle: localized().notNull(),
  formDescription: localized().notNull(),
  cancellationPolicy: localized().notNull(),
  consentLabel: localized().notNull(),
  disclaimer: localized().notNull(),
  successMessage: localized().notNull(),

  requiresSignature: boolean().notNull().default(true),
  signatureTitle: localized().notNull(),
  signatureHint: localized().notNull(),

  ...timestamps,
})

export const birthdaySteps = pgTable("birthday_step", {
  id: uuid().primaryKey().defaultRandom(),
  locationId: uuid()
    .notNull()
    .references(() => locations.id, { onDelete: "cascade" }),
  title: localized().notNull(),
  subtitle: localized().notNull(),
  imageUrl: text(),
  sortOrder: integer().notNull().default(0),
  ...timestamps,
})

export const birthdayPackageLines = pgTable("birthday_package_line", {
  id: uuid().primaryKey().defaultRandom(),
  locationId: uuid()
    .notNull()
    .references(() => locations.id, { onDelete: "cascade" }),
  text: localized().notNull(),
  sortOrder: integer().notNull().default(0),
  ...timestamps,
})

export const birthdayUpgrades = pgTable("birthday_upgrade", {
  id: uuid().primaryKey().defaultRandom(),
  locationId: uuid()
    .notNull()
    .references(() => locations.id, { onDelete: "cascade" }),
  label: localized().notNull(),
  amount: integer().notNull().default(0),
  isVisible: boolean().notNull().default(true),
  sortOrder: integer().notNull().default(0),
  ...timestamps,
})

export const formFieldType = pgEnum("form_field_type", [
  "text",
  "textarea",
  "tel",
  "email",
  "id",
  "date",
  "number",
  "select",
  "checkbox",
])

export type FormFieldType = (typeof formFieldType.enumValues)[number]

export interface FormFieldOption {
  value: string
  label: Localized
  // Weekdays (0=Sun … 6=Sat) this option is offered on. Empty/omitted = always.
  days?: number[]
}

export const birthdayFormFields = pgTable(
  "birthday_form_field",
  {
    id: uuid().primaryKey().defaultRandom(),
    locationId: uuid()
      .notNull()
      .references(() => locations.id, { onDelete: "cascade" }),
    key: text().notNull(),
    label: localized().notNull(),
    placeholder: localized(),
    type: formFieldType().notNull().default("text"),
    options: jsonb().$type<FormFieldOption[]>().notNull().default([]),
    minValue: integer(),
    maxValue: integer(),
    isRequired: boolean().notNull().default(false),
    isVisible: boolean().notNull().default(true),
    sortOrder: integer().notNull().default(0),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("birthday_form_field_location_key").on(
      table.locationId,
      table.key
    ),
  ]
)
