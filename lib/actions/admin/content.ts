"use server"

import { eq, inArray } from "drizzle-orm"
import { z } from "zod"

import { requireLocationAccess } from "@/lib/admin/access"
import { db } from "@/lib/db"
import {
  birthdayContents,
  birthdayFormFields,
  birthdayPackageLines,
  birthdaySteps,
  birthdayUpgrades,
  contactSubjects,
  galleryImages,
  homeContents,
  homeFeatures,
  menuCategories,
  menuContents,
  menuItems,
  menuTeaserTiles,
  priceRows,
  priceTiers,
  pricingContents,
  reviews,
  siteContents,
} from "@/lib/db/schema"
import { deleteObject, keyFromUrl } from "@/lib/storage"

import {
  localizedListSchema,
  localizedSchema,
  OK,
  rowIdSchema,
  syncCollection,
  type ActionResult,
} from "./shared"

/** Content sections of the admin: home page, pricing, menu, birthdays, media. */

// --- עמוד הבית --------------------------------------------------------------

const homeSchema = z.object({
  slug: z.string().min(1),
  home: z.object({
    heroBadge: localizedSchema,
    heroTitle: localizedSchema,
    heroDescription: localizedSchema,
    heroImages: z.array(z.string()).max(3),
    aboutTitle: localizedSchema,
    aboutBody: localizedSchema,
    aboutImageUrl: z.string().max(500),
    featuresCta: localizedSchema,
    reassuranceTitle: localizedSchema,
    reassuranceBody: localizedSchema,
    reassuranceCta: localizedSchema,
    menuTeaserTitle: localizedSchema,
    menuTeaserBody: localizedSchema,
    menuTeaserCta: localizedSchema,
    birthdayTeaserTitle: localizedSchema,
    birthdayTeaserBody: localizedSchema,
    birthdayTeaserCta: localizedSchema,
    birthdayTeaserImageUrl: z.string().max(500),
    galleryTitle: localizedSchema,
    reviewsTitle: localizedSchema,
  }),
  site: z.object({
    footerTagline: localizedSchema,
    contactTitle: localizedSchema,
    contactEyebrow: localizedSchema,
  }),
  features: z.array(
    z.object({
      id: rowIdSchema,
      title: localizedSchema,
      description: localizedSchema,
    })
  ),
  teaserTiles: z.array(z.object({ id: rowIdSchema, label: localizedSchema })),
  contactSubjects: z.array(
    z.object({ id: rowIdSchema, label: localizedSchema })
  ),
})

export async function saveHomeContent(
  input: z.input<typeof homeSchema>
): Promise<ActionResult> {
  const { location } = await requireLocationAccess(input.slug)

  const parsed = homeSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }
  const locationId = location.id
  const data = parsed.data

  await db
    .update(homeContents)
    .set({
      ...data.home,
      aboutImageUrl: data.home.aboutImageUrl || null,
      birthdayTeaserImageUrl: data.home.birthdayTeaserImageUrl || null,
    })
    .where(eq(homeContents.locationId, locationId))

  await db
    .update(siteContents)
    .set(data.site)
    .where(eq(siteContents.locationId, locationId))

  const existingFeatures = await db.query.homeFeatures.findMany({
    where: eq(homeFeatures.locationId, locationId),
    columns: { id: true },
  })
  await syncCollection({
    existingIds: existingFeatures.map((row) => row.id),
    incoming: data.features.map((row, sortOrder) => ({ ...row, sortOrder })),
    insert: (rows) =>
      db
        .insert(homeFeatures)
        .values(rows.map((row) => ({ ...row, locationId }))),
    update: (row) =>
      db.update(homeFeatures).set(row).where(eq(homeFeatures.id, row.id)),
    remove: (ids) =>
      db.delete(homeFeatures).where(inArray(homeFeatures.id, ids)),
  })

  const existingTiles = await db.query.menuTeaserTiles.findMany({
    where: eq(menuTeaserTiles.locationId, locationId),
    columns: { id: true },
  })
  await syncCollection({
    existingIds: existingTiles.map((row) => row.id),
    incoming: data.teaserTiles.map((row, sortOrder) => ({ ...row, sortOrder })),
    insert: (rows) =>
      db
        .insert(menuTeaserTiles)
        .values(rows.map((row) => ({ ...row, locationId }))),
    update: (row) =>
      db.update(menuTeaserTiles).set(row).where(eq(menuTeaserTiles.id, row.id)),
    remove: (ids) =>
      db.delete(menuTeaserTiles).where(inArray(menuTeaserTiles.id, ids)),
  })

  const existingSubjects = await db.query.contactSubjects.findMany({
    where: eq(contactSubjects.locationId, locationId),
    columns: { id: true },
  })
  await syncCollection({
    existingIds: existingSubjects.map((row) => row.id),
    incoming: data.contactSubjects.map((row, sortOrder) => ({
      ...row,
      sortOrder,
    })),
    insert: (rows) =>
      db
        .insert(contactSubjects)
        .values(rows.map((row) => ({ ...row, locationId }))),
    update: (row) =>
      db.update(contactSubjects).set(row).where(eq(contactSubjects.id, row.id)),
    remove: (ids) =>
      db.delete(contactSubjects).where(inArray(contactSubjects.id, ids)),
  })

  return OK
}

// --- מחירונים ---------------------------------------------------------------

const pricingSchema = z.object({
  slug: z.string().min(1),
  title: localizedSchema,
  note: localizedSchema,
  rules: localizedListSchema,
  tiers: z.array(
    z.object({
      id: rowIdSchema,
      title: localizedSchema,
      subtitle: localizedSchema,
      isFeatured: z.boolean(),
      rows: z.array(
        z.object({
          id: rowIdSchema,
          label: localizedSchema,
          amount: z.number().int().min(0),
        })
      ),
    })
  ),
})

export async function savePricing(
  input: z.input<typeof pricingSchema>
): Promise<ActionResult> {
  const { location } = await requireLocationAccess(input.slug)

  const parsed = pricingSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }
  const locationId = location.id
  const data = parsed.data

  await db
    .update(pricingContents)
    .set({ title: data.title, note: data.note, rules: data.rules })
    .where(eq(pricingContents.locationId, locationId))

  const existingTiers = await db.query.priceTiers.findMany({
    where: eq(priceTiers.locationId, locationId),
    columns: { id: true },
  })

  // Insert new tiers first so their rows have a parent id to hang from.
  const tierIds = new Map<number, string>()
  for (const [index, tier] of data.tiers.entries()) {
    if (tier.id) {
      tierIds.set(index, tier.id)
      continue
    }
    const [created] = await db
      .insert(priceTiers)
      .values({
        locationId,
        title: tier.title,
        subtitle: tier.subtitle,
        isFeatured: tier.isFeatured,
        sortOrder: index,
      })
      .returning({ id: priceTiers.id })
    tierIds.set(index, created.id)
  }

  const keptTierIds = new Set(tierIds.values())
  const removedTiers = existingTiers
    .map((tier) => tier.id)
    .filter((id) => !keptTierIds.has(id))
  if (removedTiers.length > 0)
    await db.delete(priceTiers).where(inArray(priceTiers.id, removedTiers))

  for (const [index, tier] of data.tiers.entries()) {
    const tierId = tierIds.get(index) as string
    if (tier.id) {
      await db
        .update(priceTiers)
        .set({
          title: tier.title,
          subtitle: tier.subtitle,
          isFeatured: tier.isFeatured,
          sortOrder: index,
        })
        .where(eq(priceTiers.id, tierId))
    }

    const existingRows = await db.query.priceRows.findMany({
      where: eq(priceRows.tierId, tierId),
      columns: { id: true },
    })
    await syncCollection({
      existingIds: existingRows.map((row) => row.id),
      incoming: tier.rows.map((row, sortOrder) => ({ ...row, sortOrder })),
      insert: (rows) =>
        db.insert(priceRows).values(rows.map((row) => ({ ...row, tierId }))),
      update: (row) =>
        db.update(priceRows).set(row).where(eq(priceRows.id, row.id)),
      remove: (ids) => db.delete(priceRows).where(inArray(priceRows.id, ids)),
    })
  }

  return OK
}

// --- ניהול תפריט ------------------------------------------------------------

const menuSchema = z.object({
  slug: z.string().min(1),
  title: localizedSchema,
  description: localizedSchema,
  note: localizedSchema,
  categories: z.array(
    z.object({
      id: rowIdSchema,
      label: localizedSchema,
      isVisible: z.boolean(),
      items: z.array(
        z.object({
          id: rowIdSchema,
          name: localizedSchema,
          description: localizedSchema,
          amount: z.number().int().min(0),
          isVisible: z.boolean(),
        })
      ),
    })
  ),
})

export async function saveMenu(
  input: z.input<typeof menuSchema>
): Promise<ActionResult> {
  const { location } = await requireLocationAccess(input.slug)

  const parsed = menuSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }
  const locationId = location.id
  const data = parsed.data

  await db
    .update(menuContents)
    .set({ title: data.title, description: data.description, note: data.note })
    .where(eq(menuContents.locationId, locationId))

  const existingCategories = await db.query.menuCategories.findMany({
    where: eq(menuCategories.locationId, locationId),
    columns: { id: true },
  })

  const categoryIds = new Map<number, string>()
  for (const [index, category] of data.categories.entries()) {
    if (category.id) {
      categoryIds.set(index, category.id)
      continue
    }
    const [created] = await db
      .insert(menuCategories)
      .values({
        locationId,
        label: category.label,
        isVisible: category.isVisible,
        sortOrder: index,
      })
      .returning({ id: menuCategories.id })
    categoryIds.set(index, created.id)
  }

  const keptCategoryIds = new Set(categoryIds.values())
  const removedCategories = existingCategories
    .map((category) => category.id)
    .filter((id) => !keptCategoryIds.has(id))
  if (removedCategories.length > 0)
    await db
      .delete(menuCategories)
      .where(inArray(menuCategories.id, removedCategories))

  for (const [index, category] of data.categories.entries()) {
    const categoryId = categoryIds.get(index) as string
    if (category.id) {
      await db
        .update(menuCategories)
        .set({
          label: category.label,
          isVisible: category.isVisible,
          sortOrder: index,
        })
        .where(eq(menuCategories.id, categoryId))
    }

    const existingItems = await db.query.menuItems.findMany({
      where: eq(menuItems.categoryId, categoryId),
      columns: { id: true },
    })
    await syncCollection({
      existingIds: existingItems.map((row) => row.id),
      incoming: category.items.map((row, sortOrder) => ({ ...row, sortOrder })),
      insert: (rows) =>
        db
          .insert(menuItems)
          .values(rows.map((row) => ({ ...row, categoryId }))),
      update: (row) =>
        db.update(menuItems).set(row).where(eq(menuItems.id, row.id)),
      remove: (ids) => db.delete(menuItems).where(inArray(menuItems.id, ids)),
    })
  }

  return OK
}

// --- ימי הולדת --------------------------------------------------------------

const birthdaySchema = z.object({
  slug: z.string().min(1),
  content: z.object({
    heroTitle: localizedSchema,
    heroDescription: localizedSchema,
    heroImageUrl: z.string().max(500),
    stepsTitle: localizedSchema,
    stepsNote: localizedSchema,
    packageTitle: localizedSchema,
    packageAmount: z.number().int().min(0),
    packageChildrenCount: z.number().int().min(1),
    extraChildAmount: z.number().int().min(0),
    includedTitle: localizedSchema,
    depositAmount: z.number().int().min(0),
    depositNote: localizedSchema,
    upgradesTitle: localizedSchema,
    rulesTitle: localizedSchema,
    rules: localizedListSchema,
    formTitle: localizedSchema,
    formDescription: localizedSchema,
    cancellationPolicy: localizedSchema,
    consentLabel: localizedSchema,
    disclaimer: localizedSchema,
    successMessage: localizedSchema,
    requiresSignature: z.boolean(),
    signatureTitle: localizedSchema,
    signatureHint: localizedSchema,
  }),
  steps: z.array(
    z.object({
      id: rowIdSchema,
      title: localizedSchema,
      subtitle: localizedSchema,
      imageUrl: z.string().max(500),
    })
  ),
  packageLines: z.array(z.object({ id: rowIdSchema, text: localizedSchema })),
  upgrades: z.array(
    z.object({
      id: rowIdSchema,
      label: localizedSchema,
      amount: z.number().int().min(0),
      isVisible: z.boolean(),
    })
  ),
  formFields: z.array(
    z.object({
      id: rowIdSchema,
      key: z
        .string()
        .trim()
        .min(1)
        .max(60)
        .regex(
          /^[a-zA-Z][a-zA-Z0-9_]*$/,
          "letters, digits and underscore only"
        ),
      label: localizedSchema,
      placeholder: localizedSchema,
      type: z.enum([
        "text",
        "textarea",
        "tel",
        "email",
        "date",
        "number",
        "select",
        "checkbox",
      ]),
      options: z.array(
        z.object({ value: z.string().min(1), label: localizedSchema })
      ),
      isRequired: z.boolean(),
      isVisible: z.boolean(),
    })
  ),
})

export async function saveBirthdays(
  input: z.input<typeof birthdaySchema>
): Promise<ActionResult> {
  const { location } = await requireLocationAccess(input.slug)

  const parsed = birthdaySchema.safeParse(input)
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0].message }
  const locationId = location.id
  const data = parsed.data

  const keys = data.formFields.map((field) => field.key)
  if (new Set(keys).size !== keys.length)
    return { ok: false, error: "duplicate-field-key" }

  await db
    .update(birthdayContents)
    .set({
      ...data.content,
      heroImageUrl: data.content.heroImageUrl || null,
    })
    .where(eq(birthdayContents.locationId, locationId))

  const existingSteps = await db.query.birthdaySteps.findMany({
    where: eq(birthdaySteps.locationId, locationId),
    columns: { id: true },
  })
  await syncCollection({
    existingIds: existingSteps.map((row) => row.id),
    incoming: data.steps.map((row, sortOrder) => ({
      ...row,
      imageUrl: row.imageUrl || null,
      sortOrder,
    })),
    insert: (rows) =>
      db
        .insert(birthdaySteps)
        .values(rows.map((row) => ({ ...row, locationId }))),
    update: (row) =>
      db.update(birthdaySteps).set(row).where(eq(birthdaySteps.id, row.id)),
    remove: (ids) =>
      db.delete(birthdaySteps).where(inArray(birthdaySteps.id, ids)),
  })

  const existingLines = await db.query.birthdayPackageLines.findMany({
    where: eq(birthdayPackageLines.locationId, locationId),
    columns: { id: true },
  })
  await syncCollection({
    existingIds: existingLines.map((row) => row.id),
    incoming: data.packageLines.map((row, sortOrder) => ({
      ...row,
      sortOrder,
    })),
    insert: (rows) =>
      db
        .insert(birthdayPackageLines)
        .values(rows.map((row) => ({ ...row, locationId }))),
    update: (row) =>
      db
        .update(birthdayPackageLines)
        .set(row)
        .where(eq(birthdayPackageLines.id, row.id)),
    remove: (ids) =>
      db
        .delete(birthdayPackageLines)
        .where(inArray(birthdayPackageLines.id, ids)),
  })

  const existingUpgrades = await db.query.birthdayUpgrades.findMany({
    where: eq(birthdayUpgrades.locationId, locationId),
    columns: { id: true },
  })
  await syncCollection({
    existingIds: existingUpgrades.map((row) => row.id),
    incoming: data.upgrades.map((row, sortOrder) => ({ ...row, sortOrder })),
    insert: (rows) =>
      db
        .insert(birthdayUpgrades)
        .values(rows.map((row) => ({ ...row, locationId }))),
    update: (row) =>
      db
        .update(birthdayUpgrades)
        .set(row)
        .where(eq(birthdayUpgrades.id, row.id)),
    remove: (ids) =>
      db.delete(birthdayUpgrades).where(inArray(birthdayUpgrades.id, ids)),
  })

  const existingFields = await db.query.birthdayFormFields.findMany({
    where: eq(birthdayFormFields.locationId, locationId),
    columns: { id: true },
  })
  await syncCollection({
    existingIds: existingFields.map((row) => row.id),
    incoming: data.formFields.map((row, sortOrder) => ({ ...row, sortOrder })),
    insert: (rows) =>
      db
        .insert(birthdayFormFields)
        .values(rows.map((row) => ({ ...row, locationId }))),
    update: (row) =>
      db
        .update(birthdayFormFields)
        .set(row)
        .where(eq(birthdayFormFields.id, row.id)),
    remove: (ids) =>
      db.delete(birthdayFormFields).where(inArray(birthdayFormFields.id, ids)),
  })

  return OK
}

// --- ביקורות ----------------------------------------------------------------

const reviewsSchema = z.object({
  slug: z.string().min(1),
  reviews: z.array(
    z.object({
      id: rowIdSchema,
      authorName: z.string().trim().min(1).max(120),
      rating: z.number().int().min(1).max(5),
      text: localizedSchema,
      isPublished: z.boolean(),
      publishedAt: z.string(),
    })
  ),
})

export async function saveReviews(
  input: z.input<typeof reviewsSchema>
): Promise<ActionResult> {
  const { location } = await requireLocationAccess(input.slug)

  const parsed = reviewsSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }
  const locationId = location.id

  const existing = await db.query.reviews.findMany({
    where: eq(reviews.locationId, locationId),
    columns: { id: true },
  })

  await syncCollection({
    existingIds: existing.map((row) => row.id),
    incoming: parsed.data.reviews.map((row, sortOrder) => ({
      ...row,
      publishedAt: new Date(row.publishedAt),
      sortOrder,
    })),
    insert: (rows) =>
      db.insert(reviews).values(rows.map((row) => ({ ...row, locationId }))),
    update: (row) => db.update(reviews).set(row).where(eq(reviews.id, row.id)),
    remove: (ids) => db.delete(reviews).where(inArray(reviews.id, ids)),
  })

  return OK
}

// --- מדיה -------------------------------------------------------------------

const gallerySchema = z.object({
  slug: z.string().min(1),
  images: z.array(
    z.object({
      id: rowIdSchema,
      url: z.string().min(1).max(500),
      alt: localizedSchema,
    })
  ),
})

export async function saveGallery(
  input: z.input<typeof gallerySchema>
): Promise<ActionResult> {
  const { location } = await requireLocationAccess(input.slug)

  const parsed = gallerySchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }
  const locationId = location.id

  const existing = await db.query.galleryImages.findMany({
    where: eq(galleryImages.locationId, locationId),
  })

  await syncCollection({
    existingIds: existing.map((row) => row.id),
    incoming: parsed.data.images.map((row, sortOrder) => ({
      ...row,
      sortOrder,
    })),
    insert: (rows) =>
      db
        .insert(galleryImages)
        .values(rows.map((row) => ({ ...row, locationId }))),
    update: (row) =>
      db.update(galleryImages).set(row).where(eq(galleryImages.id, row.id)),
    remove: async (ids) => {
      // Drop the objects too, so removing a photo does not leave it billable
      // and publicly reachable in the bucket.
      const removed = existing.filter((row) => ids.includes(row.id))
      await db.delete(galleryImages).where(inArray(galleryImages.id, ids))
      await Promise.all(
        removed
          .map((row) => keyFromUrl(row.url))
          .filter((key): key is string => Boolean(key))
          .map((key) => deleteObject(key))
      )
    },
  })

  return OK
}
