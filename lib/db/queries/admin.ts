import "server-only"

import { asc, desc, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import {
  leads,
  locations,
  products,
  siteContents,
  users,
} from "@/lib/db/schema"

export async function getGeneralSettings(locationId: string) {
  return db.query.locations.findFirst({
    where: eq(locations.id, locationId),
    with: {
      contact: true,
      settings: true,
      announcement: true,
      openingHours: { orderBy: (h) => [asc(h.weekday)] },
      seoEntries: true,
    },
  })
}

export async function getHomeEditor(locationId: string) {
  return db.query.locations.findFirst({
    where: eq(locations.id, locationId),
    with: {
      home: true,
      site: true,
      features: { orderBy: (f) => [asc(f.sortOrder)] },
      teaserTiles: { orderBy: (t) => [asc(t.sortOrder)] },
      contactSubjects: { orderBy: (s) => [asc(s.sortOrder)] },
    },
  })
}

export async function getPricingEditor(locationId: string) {
  return db.query.locations.findFirst({
    where: eq(locations.id, locationId),
    with: {
      pricing: true,
      priceTiers: {
        orderBy: (t) => [asc(t.sortOrder)],
        with: { rows: { orderBy: (r) => [asc(r.sortOrder)] } },
      },
    },
  })
}

export async function getMenuEditor(locationId: string) {
  return db.query.locations.findFirst({
    where: eq(locations.id, locationId),
    with: {
      menu: true,
      menuCategories: {
        orderBy: (c) => [asc(c.sortOrder)],
        with: { items: { orderBy: (i) => [asc(i.sortOrder)] } },
      },
    },
  })
}

export async function getBirthdayEditor(locationId: string) {
  return db.query.locations.findFirst({
    where: eq(locations.id, locationId),
    with: {
      birthday: true,
      steps: { orderBy: (s) => [asc(s.sortOrder)] },
      packageLines: { orderBy: (l) => [asc(l.sortOrder)] },
      upgrades: { orderBy: (u) => [asc(u.sortOrder)] },
      formFields: { orderBy: (f) => [asc(f.sortOrder)] },
    },
  })
}

export async function getReviewsEditor(locationId: string) {
  return db.query.locations.findFirst({
    where: eq(locations.id, locationId),
    with: {
      settings: true,
      reviews: { orderBy: (r) => [asc(r.sortOrder)] },
      reviewPhotos: { orderBy: (p) => [asc(p.sortOrder)] },
    },
  })
}

export async function getGalleryEditor(locationId: string) {
  return db.query.locations.findFirst({
    where: eq(locations.id, locationId),
    with: { galleryImages: { orderBy: (g) => [asc(g.sortOrder)] } },
  })
}

export async function listLeads(locationId: string) {
  return db.query.leads.findMany({
    where: eq(leads.locationId, locationId),
    orderBy: [desc(leads.createdAt)],
  })
}

export async function listAllLocations() {
  return db.query.locations.findMany({
    orderBy: (l) => [asc(l.sortOrder), asc(l.slug)],
    with: { contact: true },
  })
}

export async function listTeam() {
  return db.query.users.findMany({
    orderBy: [asc(users.createdAt)],
    with: { memberships: true },
  })
}

export async function listProducts() {
  return db.query.products.findMany({ orderBy: [asc(products.sortOrder)] })
}

export async function getTermsEditor(locationId: string) {
  return db.query.siteContents.findFirst({
    where: eq(siteContents.locationId, locationId),
    columns: { terms: true },
  })
}

export async function searchCustomerCards(query?: string, limit = 20) {
  const q = query?.trim()
  return db.query.customers.findMany({
    where: q
      ? (c, { or, ilike }) =>
          or(
            ilike(c.phone, `%${q}%`),
            ilike(c.email, `%${q}%`),
            ilike(c.fullName, `%${q}%`)
          )
      : undefined,
    orderBy: (c) => [desc(c.createdAt)],
    limit,
    with: {
      cards: {
        orderBy: (card) => [desc(card.createdAt)],
        with: {
          issuedByLocation: { columns: { name: true } },
          order: { columns: { status: true, amount: true, paidAt: true } },
          events: {
            columns: { id: true, createdAt: true },
            orderBy: (event) => [asc(event.createdAt)],
            with: { location: { columns: { name: true } } },
          },
        },
      },
    },
  })
}
