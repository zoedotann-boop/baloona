import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

import { localized, localizedList, timestamps } from "./_shared"
import { locations } from "./locations"

export const siteContents = pgTable("site_content", {
  locationId: uuid()
    .primaryKey()
    .references(() => locations.id, { onDelete: "cascade" }),
  footerTagline: localized().notNull(),
  contactTitle: localized().notNull(),
  contactEyebrow: localized().notNull(),
  terms: localized(),
  ...timestamps,
})

export const homeContents = pgTable("home_content", {
  locationId: uuid()
    .primaryKey()
    .references(() => locations.id, { onDelete: "cascade" }),

  heroTitle: localized().notNull(),
  heroDescription: localized().notNull(),
  heroImages: jsonb().$type<string[]>().notNull().default([]),

  aboutTitle: localized().notNull(),
  aboutBody: localized().notNull(),
  aboutImageUrl: text(),

  featuresCta: localized().notNull(),

  reassuranceTitle: localized().notNull(),
  reassuranceBody: localized().notNull(),
  reassuranceCta: localized().notNull(),

  menuTeaserTitle: localized().notNull(),
  menuTeaserBody: localized().notNull(),
  menuTeaserCta: localized().notNull(),

  birthdayTeaserTitle: localized().notNull(),
  birthdayTeaserBody: localized().notNull(),
  birthdayTeaserCta: localized().notNull(),
  birthdayTeaserImageUrl: text(),

  galleryTitle: localized().notNull(),
  reviewsTitle: localized().notNull(),

  ...timestamps,
})

export const homeFeatures = pgTable("home_feature", {
  id: uuid().primaryKey().defaultRandom(),
  locationId: uuid()
    .notNull()
    .references(() => locations.id, { onDelete: "cascade" }),
  title: localized().notNull(),
  description: localized().notNull(),
  sortOrder: integer().notNull().default(0),
  ...timestamps,
})

export const menuTeaserTiles = pgTable("menu_teaser_tile", {
  id: uuid().primaryKey().defaultRandom(),
  locationId: uuid()
    .notNull()
    .references(() => locations.id, { onDelete: "cascade" }),
  label: localized().notNull(),
  sortOrder: integer().notNull().default(0),
  ...timestamps,
})

export const pricingContents = pgTable("pricing_content", {
  locationId: uuid()
    .primaryKey()
    .references(() => locations.id, { onDelete: "cascade" }),
  title: localized().notNull(),
  note: localized().notNull(),
  rules: localizedList().notNull(),
  ...timestamps,
})

export const priceTiers = pgTable("price_tier", {
  id: uuid().primaryKey().defaultRandom(),
  locationId: uuid()
    .notNull()
    .references(() => locations.id, { onDelete: "cascade" }),
  title: localized().notNull(),
  subtitle: localized().notNull(),
  isFeatured: boolean().notNull().default(false),
  sortOrder: integer().notNull().default(0),
  ...timestamps,
})

export const priceRows = pgTable("price_row", {
  id: uuid().primaryKey().defaultRandom(),
  tierId: uuid()
    .notNull()
    .references(() => priceTiers.id, { onDelete: "cascade" }),
  label: localized().notNull(),
  amount: integer().notNull().default(0),
  sortOrder: integer().notNull().default(0),
  ...timestamps,
})

export const galleryImages = pgTable("gallery_image", {
  id: uuid().primaryKey().defaultRandom(),
  locationId: uuid()
    .notNull()
    .references(() => locations.id, { onDelete: "cascade" }),
  url: text().notNull(),
  alt: localized().notNull(),
  sortOrder: integer().notNull().default(0),
  ...timestamps,
})

export const reviewPhotos = pgTable("review_photo", {
  id: uuid().primaryKey().defaultRandom(),
  locationId: uuid()
    .notNull()
    .references(() => locations.id, { onDelete: "cascade" }),
  url: text().notNull(),
  alt: localized().notNull(),
  sortOrder: integer().notNull().default(0),
  ...timestamps,
})

export const reviewSource = pgEnum("review_source", ["manual", "google"])

export type ReviewSource = (typeof reviewSource.enumValues)[number]

export const reviews = pgTable("review", {
  id: uuid().primaryKey().defaultRandom(),
  locationId: uuid()
    .notNull()
    .references(() => locations.id, { onDelete: "cascade" }),
  authorName: text().notNull(),
  rating: smallint().notNull().default(5),
  text: text().notNull(),
  source: reviewSource().notNull().default("manual"),
  externalId: text(),
  publishedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  isPublished: boolean().notNull().default(true),
  sortOrder: integer().notNull().default(0),
  ...timestamps,
})

export const contactSubjects = pgTable("contact_subject", {
  id: uuid().primaryKey().defaultRandom(),
  locationId: uuid()
    .notNull()
    .references(() => locations.id, { onDelete: "cascade" }),
  label: localized().notNull(),
  sortOrder: integer().notNull().default(0),
  ...timestamps,
})
