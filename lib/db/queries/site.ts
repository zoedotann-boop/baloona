import "server-only"

import { asc, desc, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { locations, products, punchCards, type SeoPage } from "@/lib/db/schema"

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

const HOME_REVIEWS_LIMIT = 9

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
      reviewPhotos: { orderBy: (p) => [asc(p.sortOrder)] },
      reviews: {
        where: (r) => eq(r.isPublished, true),
        orderBy: (r) => [asc(r.sortOrder), desc(r.publishedAt)],
        limit: HOME_REVIEWS_LIMIT,
      },
    },
  })
}

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

export async function getPunchCardByToken(token: string) {
  return db.query.punchCards.findFirst({
    where: eq(punchCards.token, token),
    with: {
      customer: { columns: { fullName: true } },
      issuedByLocation: { columns: { name: true } },
      events: {
        columns: { id: true, createdAt: true },
        orderBy: (event) => [asc(event.createdAt)],
        with: { location: { columns: { name: true } } },
      },
    },
  })
}

export async function listActiveProducts() {
  return db.query.products.findMany({
    where: eq(products.isActive, true),
    orderBy: (p) => [asc(p.sortOrder)],
  })
}

export async function getProductById(id: string) {
  return db.query.products.findFirst({ where: eq(products.id, id) })
}

export async function getTermsPage(slug: string) {
  return db.query.locations.findFirst({
    where: eq(locations.slug, slug),
    columns: { id: true },
    with: { site: { columns: { terms: true } } },
  })
}

export async function getSeoEntry(locationId: string, page: SeoPage) {
  return db.query.seoEntries.findFirst({
    where: (s, { and, eq: is }) =>
      and(is(s.locationId, locationId), is(s.page, page)),
  })
}
