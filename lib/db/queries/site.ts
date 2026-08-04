import "server-only"

import { asc, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { locations, type SeoPage } from "@/lib/db/schema"

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
        orderBy: (r) => [asc(r.sortOrder)],
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

/** SEO row for one page of a location, used by `generateMetadata`. */
export async function getSeoEntry(locationId: string, page: SeoPage) {
  return db.query.seoEntries.findFirst({
    where: (s, { and, eq: is }) =>
      and(is(s.locationId, locationId), is(s.page, page)),
  })
}
