import { relations } from "drizzle-orm"

import { locationMembers, users } from "./auth"
import {
  birthdayContents,
  birthdayFormFields,
  birthdayPackageLines,
  birthdaySteps,
  birthdayUpgrades,
} from "./birthdays"
import {
  contactSubjects,
  galleryImages,
  homeContents,
  homeFeatures,
  menuTeaserTiles,
  priceRows,
  priceTiers,
  pricingContents,
  reviews,
  siteContents,
} from "./content"
import { leads } from "./leads"
import {
  announcements,
  locationContacts,
  locations,
  openingHours,
  seoEntries,
  siteSettings,
} from "./locations"
import { menuCategories, menuContents, menuItems } from "./menu"

/**
 * Relations live in one file so the table modules stay a directed graph
 * (everything imports `locations`, nothing imports back) while Drizzle's
 * relational query API can still load a whole location in a single call.
 */

export const locationsRelations = relations(locations, ({ one, many }) => ({
  contact: one(locationContacts),
  settings: one(siteSettings),
  announcement: one(announcements),
  site: one(siteContents),
  home: one(homeContents),
  pricing: one(pricingContents),
  menu: one(menuContents),
  birthday: one(birthdayContents),
  openingHours: many(openingHours),
  seoEntries: many(seoEntries),
  features: many(homeFeatures),
  teaserTiles: many(menuTeaserTiles),
  priceTiers: many(priceTiers),
  menuCategories: many(menuCategories),
  steps: many(birthdaySteps),
  packageLines: many(birthdayPackageLines),
  upgrades: many(birthdayUpgrades),
  formFields: many(birthdayFormFields),
  reviews: many(reviews),
  galleryImages: many(galleryImages),
  contactSubjects: many(contactSubjects),
  leads: many(leads),
  members: many(locationMembers),
}))

export const locationContactsRelations = relations(
  locationContacts,
  ({ one }) => ({
    location: one(locations, {
      fields: [locationContacts.locationId],
      references: [locations.id],
    }),
  })
)

export const siteSettingsRelations = relations(siteSettings, ({ one }) => ({
  location: one(locations, {
    fields: [siteSettings.locationId],
    references: [locations.id],
  }),
}))

export const announcementsRelations = relations(announcements, ({ one }) => ({
  location: one(locations, {
    fields: [announcements.locationId],
    references: [locations.id],
  }),
}))

export const openingHoursRelations = relations(openingHours, ({ one }) => ({
  location: one(locations, {
    fields: [openingHours.locationId],
    references: [locations.id],
  }),
}))

export const seoEntriesRelations = relations(seoEntries, ({ one }) => ({
  location: one(locations, {
    fields: [seoEntries.locationId],
    references: [locations.id],
  }),
}))

export const siteContentsRelations = relations(siteContents, ({ one }) => ({
  location: one(locations, {
    fields: [siteContents.locationId],
    references: [locations.id],
  }),
}))

export const homeContentsRelations = relations(homeContents, ({ one }) => ({
  location: one(locations, {
    fields: [homeContents.locationId],
    references: [locations.id],
  }),
}))

export const homeFeaturesRelations = relations(homeFeatures, ({ one }) => ({
  location: one(locations, {
    fields: [homeFeatures.locationId],
    references: [locations.id],
  }),
}))

export const menuTeaserTilesRelations = relations(
  menuTeaserTiles,
  ({ one }) => ({
    location: one(locations, {
      fields: [menuTeaserTiles.locationId],
      references: [locations.id],
    }),
  })
)

export const pricingContentsRelations = relations(
  pricingContents,
  ({ one }) => ({
    location: one(locations, {
      fields: [pricingContents.locationId],
      references: [locations.id],
    }),
  })
)

export const priceTiersRelations = relations(priceTiers, ({ one, many }) => ({
  location: one(locations, {
    fields: [priceTiers.locationId],
    references: [locations.id],
  }),
  rows: many(priceRows),
}))

export const priceRowsRelations = relations(priceRows, ({ one }) => ({
  tier: one(priceTiers, {
    fields: [priceRows.tierId],
    references: [priceTiers.id],
  }),
}))

export const galleryImagesRelations = relations(galleryImages, ({ one }) => ({
  location: one(locations, {
    fields: [galleryImages.locationId],
    references: [locations.id],
  }),
}))

export const reviewsRelations = relations(reviews, ({ one }) => ({
  location: one(locations, {
    fields: [reviews.locationId],
    references: [locations.id],
  }),
}))

export const contactSubjectsRelations = relations(
  contactSubjects,
  ({ one }) => ({
    location: one(locations, {
      fields: [contactSubjects.locationId],
      references: [locations.id],
    }),
  })
)

export const menuContentsRelations = relations(menuContents, ({ one }) => ({
  location: one(locations, {
    fields: [menuContents.locationId],
    references: [locations.id],
  }),
}))

export const menuCategoriesRelations = relations(
  menuCategories,
  ({ one, many }) => ({
    location: one(locations, {
      fields: [menuCategories.locationId],
      references: [locations.id],
    }),
    items: many(menuItems),
  })
)

export const menuItemsRelations = relations(menuItems, ({ one }) => ({
  category: one(menuCategories, {
    fields: [menuItems.categoryId],
    references: [menuCategories.id],
  }),
}))

export const birthdayContentsRelations = relations(
  birthdayContents,
  ({ one }) => ({
    location: one(locations, {
      fields: [birthdayContents.locationId],
      references: [locations.id],
    }),
  })
)

export const birthdayStepsRelations = relations(birthdaySteps, ({ one }) => ({
  location: one(locations, {
    fields: [birthdaySteps.locationId],
    references: [locations.id],
  }),
}))

export const birthdayPackageLinesRelations = relations(
  birthdayPackageLines,
  ({ one }) => ({
    location: one(locations, {
      fields: [birthdayPackageLines.locationId],
      references: [locations.id],
    }),
  })
)

export const birthdayUpgradesRelations = relations(
  birthdayUpgrades,
  ({ one }) => ({
    location: one(locations, {
      fields: [birthdayUpgrades.locationId],
      references: [locations.id],
    }),
  })
)

export const birthdayFormFieldsRelations = relations(
  birthdayFormFields,
  ({ one }) => ({
    location: one(locations, {
      fields: [birthdayFormFields.locationId],
      references: [locations.id],
    }),
  })
)

export const leadsRelations = relations(leads, ({ one }) => ({
  location: one(locations, {
    fields: [leads.locationId],
    references: [locations.id],
  }),
}))

export const usersRelations = relations(users, ({ many }) => ({
  memberships: many(locationMembers),
}))

export const locationMembersRelations = relations(
  locationMembers,
  ({ one }) => ({
    user: one(users, {
      fields: [locationMembers.userId],
      references: [users.id],
    }),
    location: one(locations, {
      fields: [locationMembers.locationId],
      references: [locations.id],
    }),
  })
)
