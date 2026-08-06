import "server-only"

import { asc, desc, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { leads, locations, users } from "@/lib/db/schema"

/**
 * Read models for the admin.
 *
 * These load the editable rows verbatim — ids, hidden items and untranslated
 * values included — because the admin edits the record, not the rendered page.
 */

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
    },
  })
}

export async function getGalleryEditor(locationId: string) {
  return db.query.locations.findFirst({
    where: eq(locations.id, locationId),
    with: { galleryImages: { orderBy: (g) => [asc(g.sortOrder)] } },
  })
}

/** Newest first — the inbox is read top-down. */
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

/**
 * Customers and their punch cards for the front-desk manager. Punch cards are
 * brand-global, so this is not scoped to a location: a clerk at any branch finds
 * any customer. A blank query returns the most recent customers as a starting
 * point; a query matches phone, email or name.
 */
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
        with: { issuedByLocation: { columns: { name: true } } },
      },
    },
  })
}
