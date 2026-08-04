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

/**
 * A venue. Every piece of editable content hangs off a location, so opening a
 * branch is "insert a row and seed its content" rather than a code change.
 * Visitors reach a location at `/<slug>`; `/` lists them all.
 */
export const locations = pgTable("location", {
  id: uuid().primaryKey().defaultRandom(),
  slug: text().notNull().unique(),
  name: localized().notNull(),
  isPublished: boolean().notNull().default(false),
  sortOrder: integer().notNull().default(0),
  ...timestamps,
})

/** Contact details and socials. One row per location. */
export const locationContacts = pgTable("location_contact", {
  locationId: uuid()
    .primaryKey()
    .references(() => locations.id, { onDelete: "cascade" }),
  city: localized().notNull(),
  address: localized().notNull(),
  phone: text().notNull().default(""),
  /** International format without `+`, e.g. `972501234567`. */
  whatsapp: text().notNull().default(""),
  email: text().notNull().default(""),
  /** Where lead notifications are emailed. Falls back to `email` when blank. */
  leadRecipientEmail: text().notNull().default(""),
  instagramUrl: text(),
  facebookUrl: text(),
  tiktokUrl: text(),
  ...timestamps,
})

/**
 * Opening hours, one row per weekday (0 = Sunday … 6 = Saturday). Times are
 * stored as `HH:mm` strings: the site only ever prints them, and a `time`
 * column would drag timezone semantics into a purely presentational value.
 */
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

/** Analytics, sharing images and third-party ids. One row per location. */
export const siteSettings = pgTable("site_setting", {
  locationId: uuid()
    .primaryKey()
    .references(() => locations.id, { onDelete: "cascade" }),
  /** Used by the reviews sync to pull this branch's Google reviews. */
  googlePlaceId: text(),
  gaMeasurementId: text(),
  metaPixelId: text(),
  gtmContainerId: text(),
  faviconUrl: text(),
  ogImageUrl: text(),
  ...timestamps,
})

/** Public pages that carry their own `<title>` and description. */
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

/**
 * The site-wide pop-up: a title plus any combination of a paragraph, bullet
 * lines and a call to action — editors fill only the parts they need. Bumping
 * `version` re-shows the pop-up to visitors who already dismissed it.
 */
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
