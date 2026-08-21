import "server-only"

import { db } from "@/lib/db"
import {
  announcementContent,
  birthdayContent,
  birthdayFormFieldRows,
  birthdayPackageLineRows,
  birthdayStepRows,
  birthdayUpgradeRows,
  contactSubjectRows,
  galleryImageRows,
  homeContent,
  homeFeatureRows,
  menuCategoryRows,
  menuContent,
  menuTeaserTileRows,
  priceTierRows,
  pricingContent,
  seoEntryRows,
  siteContent,
} from "@/lib/db/seed-content"
import {
  announcements,
  birthdayContents,
  birthdayFormFields,
  birthdayPackageLines,
  birthdaySteps,
  birthdayUpgrades,
  contactSubjects,
  galleryImages,
  homeContents,
  homeFeatures,
  locationContacts,
  locations,
  menuCategories,
  menuContents,
  menuItems,
  menuTeaserTiles,
  openingHours,
  priceRows,
  priceTiers,
  pricingContents,
  seoEntries,
  siteContents,
  siteSettings,
} from "@/lib/db/schema"
import type { Localized } from "@/lib/localized"

export interface NewLocationInput {
  slug: string
  name: Localized
  city: Localized
  address: Localized
  phone: string
  whatsapp: string
  email: string
  leadRecipientEmail: string
  isPublished?: boolean
  sortOrder?: number
  /** `[opensAt, closesAt, isClosed]` per weekday, Sunday first. */
  hours?: [string, string, boolean][]
}

const DEFAULT_HOURS: [string, string, boolean][] = [
  ["09:00", "19:00", false],
  ["09:00", "19:00", false],
  ["09:00", "19:00", false],
  ["09:00", "19:00", false],
  ["09:00", "19:00", false],
  ["09:00", "15:00", false],
  ["09:00", "19:00", false],
]

/**
 * Create a location together with a complete set of starter content.
 *
 * Opening a branch is a data operation, not a deploy: the new site is fully
 * populated from the shared blueprint and the manager edits it from there,
 * which is also why "add location" in the admin can be a single form.
 */
export async function provisionLocation(
  input: NewLocationInput
): Promise<string> {
  const [location] = await db
    .insert(locations)
    .values({
      slug: input.slug,
      name: input.name,
      isPublished: input.isPublished ?? false,
      sortOrder: input.sortOrder ?? 0,
    })
    .returning({ id: locations.id })

  const locationId = location.id

  await db.insert(locationContacts).values({
    locationId,
    city: input.city,
    address: input.address,
    phone: input.phone,
    whatsapp: input.whatsapp,
    email: input.email,
    leadRecipientEmail: input.leadRecipientEmail || input.email,
  })

  await db.insert(openingHours).values(
    (input.hours ?? DEFAULT_HOURS).map(([opensAt, closesAt, isClosed], i) => ({
      locationId,
      weekday: i,
      opensAt,
      closesAt,
      isClosed,
    }))
  )

  await db.insert(siteSettings).values({ locationId })
  await db
    .insert(siteContents)
    .values({ locationId, ...siteContent(input.city) })
  await db.insert(announcements).values({ locationId, ...announcementContent })
  await db.insert(homeContents).values({ locationId, ...homeContent })
  await db.insert(pricingContents).values({ locationId, ...pricingContent })
  await db.insert(menuContents).values({ locationId, ...menuContent })
  await db.insert(birthdayContents).values({ locationId, ...birthdayContent })

  await db
    .insert(seoEntries)
    .values(seoEntryRows(input.city).map((entry) => ({ locationId, ...entry })))

  await db.insert(homeFeatures).values(
    homeFeatureRows.map((row, sortOrder) => ({
      locationId,
      ...row,
      sortOrder,
    }))
  )

  await db.insert(menuTeaserTiles).values(
    menuTeaserTileRows.map((row, sortOrder) => ({
      locationId,
      ...row,
      sortOrder,
    }))
  )

  await db.insert(contactSubjects).values(
    contactSubjectRows.map((row, sortOrder) => ({
      locationId,
      ...row,
      sortOrder,
    }))
  )

  await db.insert(galleryImages).values(
    galleryImageRows.map((row, sortOrder) => ({
      locationId,
      ...row,
      sortOrder,
    }))
  )

  // No starter reviews on purpose — see the note in `seed-content.ts`.

  const tiers = await db
    .insert(priceTiers)
    .values(
      priceTierRows.map(({ rows: _rows, ...tier }, sortOrder) => ({
        locationId,
        ...tier,
        sortOrder,
      }))
    )
    .returning({ id: priceTiers.id })

  await db.insert(priceRows).values(
    priceTierRows.flatMap((tier, index) =>
      tier.rows.map((row, sortOrder) => ({
        tierId: tiers[index].id,
        ...row,
        sortOrder,
      }))
    )
  )

  const categories = await db
    .insert(menuCategories)
    .values(
      menuCategoryRows.map(({ items: _items, ...category }, sortOrder) => ({
        locationId,
        ...category,
        sortOrder,
      }))
    )
    .returning({ id: menuCategories.id })

  await db.insert(menuItems).values(
    menuCategoryRows.flatMap((category, index) =>
      category.items.map((item, sortOrder) => ({
        categoryId: categories[index].id,
        ...item,
        sortOrder,
      }))
    )
  )

  await db.insert(birthdaySteps).values(
    birthdayStepRows.map((row, sortOrder) => ({
      locationId,
      ...row,
      sortOrder,
    }))
  )

  await db.insert(birthdayPackageLines).values(
    birthdayPackageLineRows.map((row, sortOrder) => ({
      locationId,
      ...row,
      sortOrder,
    }))
  )

  await db.insert(birthdayUpgrades).values(
    birthdayUpgradeRows.map((row, sortOrder) => ({
      locationId,
      ...row,
      sortOrder,
    }))
  )

  await db.insert(birthdayFormFields).values(
    birthdayFormFieldRows.map((row, sortOrder) => ({
      locationId,
      ...row,
      sortOrder,
    }))
  )

  return locationId
}
