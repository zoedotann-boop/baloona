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

/**
 * Copy that appears on every page (footer strapline, the contact block above
 * the footer) rather than only on the home page.
 */
export const siteContents = pgTable("site_content", {
  locationId: uuid()
    .primaryKey()
    .references(() => locations.id, { onDelete: "cascade" }),
  footerTagline: localized().notNull(),
  contactTitle: localized().notNull(),
  contactEyebrow: localized().notNull(),
  /** Terms & cancellation policy body for `/<slug>/terms`; the `/terms` page
   *  falls back to the default copy in `messages` while this is empty. */
  terms: localized(),
  ...timestamps,
})

/**
 * Home page copy. One row per location, one column per editable string, so the
 * admin form and the page render from the same shape and a missing translation
 * is visible rather than silently absent.
 */
export const homeContents = pgTable("home_content", {
  locationId: uuid()
    .primaryKey()
    .references(() => locations.id, { onDelete: "cascade" }),

  heroTitle: localized().notNull(),
  heroDescription: localized().notNull(),
  /** Three images for the hero mosaic, largest first. */
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

/** The three "what you get" columns under the hero. */
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

/** Category chips in the home page's menu teaser. */
export const menuTeaserTiles = pgTable("menu_teaser_tile", {
  id: uuid().primaryKey().defaultRandom(),
  locationId: uuid()
    .notNull()
    .references(() => locations.id, { onDelete: "cascade" }),
  label: localized().notNull(),
  sortOrder: integer().notNull().default(0),
  ...timestamps,
})

/** Heading, footnote and "good to know" rules around the price tiers. */
export const pricingContents = pgTable("pricing_content", {
  locationId: uuid()
    .primaryKey()
    .references(() => locations.id, { onDelete: "cascade" }),
  title: localized().notNull(),
  note: localized().notNull(),
  rules: localizedList().notNull(),
  ...timestamps,
})

/** One entry-price card (weekdays, weekend, punch card, …). */
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

/**
 * A price line inside a tier. Amounts are whole shekels: storing a number keeps
 * the admin input numeric and leaves currency formatting to the render layer.
 */
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

/** Where a review came from. Google reviews are refreshed by the Places sync. */
export const reviewSource = pgEnum("review_source", ["manual", "google"])

export type ReviewSource = (typeof reviewSource.enumValues)[number]

export const reviews = pgTable("review", {
  id: uuid().primaryKey().defaultRandom(),
  locationId: uuid()
    .notNull()
    .references(() => locations.id, { onDelete: "cascade" }),
  authorName: text().notNull(),
  rating: smallint().notNull().default(5),
  /**
   * The review as its author wrote it, in whatever language that was.
   *
   * Not `localized()` like the rest of the site's copy: a review is someone
   * else's words, so there is nothing to translate into — rendering a machine
   * translation under a real person's name would be putting words in their
   * mouth. It is stored once and shown as-is in every locale.
   */
  text: text().notNull(),
  source: reviewSource().notNull().default("manual"),
  /** Google's review id, used to upsert on re-sync. Null for manual reviews. */
  externalId: text(),
  publishedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  isPublished: boolean().notNull().default(true),
  sortOrder: integer().notNull().default(0),
  ...timestamps,
})

/** Subject chips offered by the contact form. */
export const contactSubjects = pgTable("contact_subject", {
  id: uuid().primaryKey().defaultRandom(),
  locationId: uuid()
    .notNull()
    .references(() => locations.id, { onDelete: "cascade" }),
  label: localized().notNull(),
  sortOrder: integer().notNull().default(0),
  ...timestamps,
})
