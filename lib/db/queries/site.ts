import "server-only"

import { asc, desc, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { locations, products, punchCards, type SeoPage } from "@/lib/db/schema"

/**
 * Read models for the public site.
 *
 * Each page loads exactly what it renders in one relational query. Pages render
 * dynamically — a venue site is read-mostly but low traffic, and going straight
 * to Neon makes "publish" in the admin instantly visible with no cache
 * invalidation to reason about.
 */

/** Published locations for the chooser at `/`. */
export async function listPublishedLocations() {
  return db.query.locations.findMany({
    where: eq(locations.isPublished, true),
    orderBy: (l) => [asc(l.sortOrder), asc(l.slug)],
    with: {
      contact: true,
      home: { columns: { heroImages: true, heroDescription: true } },
    },
  })
}

/**
 * Chrome shared by every page of a location: header, contact block and footer.
 * Returns `undefined` for unknown slugs so the caller can 404.
 */
export async function getLocationChrome(slug: string) {
  return db.query.locations.findFirst({
    where: eq(locations.slug, slug),
    with: {
      contact: true,
      site: true,
      settings: true,
      announcement: true,
      openingHours: { orderBy: (h) => [asc(h.weekday)] },
      contactSubjects: { orderBy: (s) => [asc(s.sortOrder)] },
    },
  })
}

export type LocationChrome = NonNullable<
  Awaited<ReturnType<typeof getLocationChrome>>
>

/**
 * How many reviews the home page masonry shows. The nightly Google sync
 * publishes on its own, so the section needs a ceiling of its own — without
 * one it would grow by a few cards every night, forever.
 */
const HOME_REVIEWS_LIMIT = 9

/** Everything the home page renders. */
export async function getHomePage(slug: string) {
  return db.query.locations.findFirst({
    where: eq(locations.slug, slug),
    with: {
      home: true,
      pricing: true,
      features: { orderBy: (f) => [asc(f.sortOrder)] },
      teaserTiles: { orderBy: (t) => [asc(t.sortOrder)] },
      priceTiers: {
        orderBy: (t) => [asc(t.sortOrder)],
        with: { rows: { orderBy: (r) => [asc(r.sortOrder)] } },
      },
      galleryImages: { orderBy: (g) => [asc(g.sortOrder)] },
      reviews: {
        where: (r) => eq(r.isPublished, true),
        // `sortOrder` first so an editor can pin a favourite to the top, then
        // newest, which is what decides the tie between synced Google reviews
        // (they all arrive at the default 0).
        orderBy: (r) => [asc(r.sortOrder), desc(r.publishedAt)],
        limit: HOME_REVIEWS_LIMIT,
      },
    },
  })
}

/** Everything the menu page renders. */
export async function getMenuPage(slug: string) {
  return db.query.locations.findFirst({
    where: eq(locations.slug, slug),
    with: {
      menu: true,
      menuCategories: {
        where: (c) => eq(c.isVisible, true),
        orderBy: (c) => [asc(c.sortOrder)],
        with: {
          items: {
            where: (i) => eq(i.isVisible, true),
            orderBy: (i) => [asc(i.sortOrder)],
          },
        },
      },
    },
  })
}

/** Everything the birthdays page renders, including the editable form spec. */
export async function getBirthdayPage(slug: string) {
  return db.query.locations.findFirst({
    where: eq(locations.slug, slug),
    with: {
      birthday: true,
      steps: { orderBy: (s) => [asc(s.sortOrder)] },
      packageLines: { orderBy: (l) => [asc(l.sortOrder)] },
      upgrades: {
        where: (u) => eq(u.isVisible, true),
        orderBy: (u) => [asc(u.sortOrder)],
      },
      formFields: {
        where: (f) => eq(f.isVisible, true),
        orderBy: (f) => [asc(f.sortOrder)],
      },
    },
  })
}

/**
 * A punch card by its share token, for the customer's `/card/<token>` view.
 * Global to the brand (not scoped to a branch); returns `undefined` for unknown
 * tokens so the caller can 404. The token is the only credential — there is no
 * customer login — so it must be unguessable.
 */
export async function getPunchCardByToken(token: string) {
  return db.query.punchCards.findFirst({
    where: eq(punchCards.token, token),
    with: {
      customer: { columns: { fullName: true } },
      issuedByLocation: { columns: { name: true } },
    },
  })
}

/**
 * Active shop products for the global `/shop` page, in display order. Products
 * are brand-global (not scoped to a branch), so this is not location-filtered.
 */
export async function listActiveProducts() {
  return db.query.products.findMany({
    where: eq(products.isActive, true),
    orderBy: (p) => [asc(p.sortOrder)],
  })
}

/** A single product for the checkout page; `undefined` for unknown/removed ids. */
export async function getProductById(id: string) {
  return db.query.products.findFirst({ where: eq(products.id, id) })
}

/**
 * Terms body for a branch's `/<slug>/terms` page. Returns the location (so the
 * caller can 404 on unknown slugs) with its editable `terms`; when that is empty
 * the page renders the default copy from `messages`.
 */
export async function getTermsPage(slug: string) {
  return db.query.locations.findFirst({
    where: eq(locations.slug, slug),
    columns: { id: true },
    with: { site: { columns: { terms: true } } },
  })
}

/** SEO row for one page of a location, used by `generateMetadata`. */
export async function getSeoEntry(locationId: string, page: SeoPage) {
  return db.query.seoEntries.findFirst({
    where: (s, { and, eq: is }) =>
      and(is(s.locationId, locationId), is(s.page, page)),
  })
}
