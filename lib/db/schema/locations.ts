import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  smallint,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"

import { localized, localizedList, timestamps } from "./_shared"

export const locations = pgTable("location", {
  id: uuid().primaryKey().defaultRandom(),
  slug: text().notNull().unique(),
  name: localized().notNull(),
  isPublished: boolean().notNull().default(false),
  sortOrder: integer().notNull().default(0),
  ...timestamps,
})

export const locationContacts = pgTable("location_contact", {
  locationId: uuid()
    .primaryKey()
    .references(() => locations.id, { onDelete: "cascade" }),
  city: localized().notNull(),
  address: localized().notNull(),
  phone: text().notNull().default(""),
  whatsapp: text().notNull().default(""),
  email: text().notNull().default(""),
  leadRecipientEmail: text().notNull().default(""),
  instagramUrl: text(),
  facebookUrl: text(),
  tiktokUrl: text(),
  ...timestamps,
})

export const openingHours = pgTable(
  "opening_hour",
  {
    id: uuid().primaryKey().defaultRandom(),
    locationId: uuid()
      .notNull()
      .references(() => locations.id, { onDelete: "cascade" }),
    weekday: smallint().notNull(),
    opensAt: text().notNull().default("09:00"),
    closesAt: text().notNull().default("19:00"),
    isClosed: boolean().notNull().default(false),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("opening_hour_location_weekday").on(
      table.locationId,
      table.weekday
    ),
  ]
)

export const siteSettings = pgTable("site_setting", {
  locationId: uuid()
    .primaryKey()
    .references(() => locations.id, { onDelete: "cascade" }),
  googlePlaceId: text(),
  googleReviewsAutoSync: boolean().notNull().default(false),
  gaMeasurementId: text(),
  metaPixelId: text(),
  gtmContainerId: text(),
  faviconUrl: text(),
  ogImageUrl: text(),
  ...timestamps,
})

export const seoPage = pgEnum("seo_page", ["home", "menu", "birthdays"])

export type SeoPage = (typeof seoPage.enumValues)[number]

export const seoEntries = pgTable(
  "seo_entry",
  {
    id: uuid().primaryKey().defaultRandom(),
    locationId: uuid()
      .notNull()
      .references(() => locations.id, { onDelete: "cascade" }),
    page: seoPage().notNull(),
    title: localized().notNull(),
    description: localized().notNull(),
    keywords: localized(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("seo_entry_location_page").on(table.locationId, table.page),
  ]
)

export const announcements = pgTable("announcement", {
  locationId: uuid()
    .primaryKey()
    .references(() => locations.id, { onDelete: "cascade" }),
  isActive: boolean().notNull().default(false),
  version: integer().notNull().default(1),
  title: localized().notNull(),
  body: localized(),
  lines: localizedList(),
  ctaLabel: localized(),
  ctaHref: text(),
  ...timestamps,
})
