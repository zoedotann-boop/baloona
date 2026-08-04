"use server"

import { and, eq } from "drizzle-orm"
import { z } from "zod"

import { requireLocationAccess } from "@/lib/admin/access"
import { db } from "@/lib/db"
import {
  announcements,
  locationContacts,
  openingHours,
  seoEntries,
  siteSettings,
} from "@/lib/db/schema"

import {
  localizedListSchema,
  localizedSchema,
  OK,
  type ActionResult,
} from "./shared"

/** הגדרות כלליות — contact details, opening hours, the pop-up, SEO and tracking. */

const contactSchema = z.object({
  slug: z.string().min(1),
  city: localizedSchema,
  address: localizedSchema,
  phone: z.string().trim().max(40),
  whatsapp: z
    .string()
    .trim()
    .max(20)
    .regex(/^\d*$/, "digits only, international format without +"),
  email: z.union([z.email(), z.literal("")]),
  leadRecipientEmail: z.union([z.email(), z.literal("")]),
  instagramUrl: z.union([z.url(), z.literal("")]),
  facebookUrl: z.union([z.url(), z.literal("")]),
  tiktokUrl: z.union([z.url(), z.literal("")]),
})

export async function saveContact(
  input: z.input<typeof contactSchema>
): Promise<ActionResult> {
  const { location } = await requireLocationAccess(input.slug)

  const parsed = contactSchema.safeParse(input)
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0].message }
  const { slug: _slug, ...values } = parsed.data

  await db
    .update(locationContacts)
    .set({
      ...values,
      instagramUrl: values.instagramUrl || null,
      facebookUrl: values.facebookUrl || null,
      tiktokUrl: values.tiktokUrl || null,
    })
    .where(eq(locationContacts.locationId, location.id))

  return OK
}

const hoursSchema = z.object({
  slug: z.string().min(1),
  days: z
    .array(
      z.object({
        weekday: z.number().int().min(0).max(6),
        opensAt: z.string().regex(/^\d{2}:\d{2}$/),
        closesAt: z.string().regex(/^\d{2}:\d{2}$/),
        isClosed: z.boolean(),
      })
    )
    .length(7),
})

export async function saveOpeningHours(
  input: z.input<typeof hoursSchema>
): Promise<ActionResult> {
  const { location } = await requireLocationAccess(input.slug)

  const parsed = hoursSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }

  for (const day of parsed.data.days) {
    await db
      .update(openingHours)
      .set({
        opensAt: day.opensAt,
        closesAt: day.closesAt,
        isClosed: day.isClosed,
      })
      .where(
        and(
          eq(openingHours.locationId, location.id),
          eq(openingHours.weekday, day.weekday)
        )
      )
  }

  return OK
}

const announcementSchema = z.object({
  slug: z.string().min(1),
  isActive: z.boolean(),
  title: localizedSchema,
  body: localizedSchema,
  lines: localizedListSchema,
  ctaLabel: localizedSchema,
  ctaHref: z.string().trim().max(500),
  /** Set by the editor's "show again to everyone" control. */
  bumpVersion: z.boolean().default(false),
})

export async function saveAnnouncement(
  input: z.input<typeof announcementSchema>
): Promise<ActionResult> {
  const { location } = await requireLocationAccess(input.slug)

  const parsed = announcementSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }
  const current = await db.query.announcements.findFirst({
    where: eq(announcements.locationId, location.id),
  })

  const values = {
    isActive: parsed.data.isActive,
    title: parsed.data.title,
    body: parsed.data.body,
    lines: parsed.data.lines,
    ctaLabel: parsed.data.ctaLabel,
    ctaHref: parsed.data.ctaHref || null,
    version: (current?.version ?? 1) + (parsed.data.bumpVersion ? 1 : 0),
  }

  if (current) {
    await db
      .update(announcements)
      .set(values)
      .where(eq(announcements.locationId, location.id))
  } else {
    await db
      .insert(announcements)
      .values({ locationId: location.id, ...values })
  }

  return OK
}

const seoSchema = z.object({
  slug: z.string().min(1),
  pages: z.array(
    z.object({
      page: z.enum(["home", "menu", "birthdays"]),
      title: localizedSchema,
      description: localizedSchema,
      keywords: localizedSchema,
    })
  ),
  googlePlaceId: z.string().trim().max(200),
  gaMeasurementId: z.string().trim().max(50),
  metaPixelId: z.string().trim().max(50),
  gtmContainerId: z.string().trim().max(50),
  faviconUrl: z.string().trim().max(500),
  ogImageUrl: z.string().trim().max(500),
})

export async function saveSeo(
  input: z.input<typeof seoSchema>
): Promise<ActionResult> {
  const { location } = await requireLocationAccess(input.slug)

  const parsed = seoSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }
  const data = parsed.data

  for (const page of data.pages) {
    const existing = await db.query.seoEntries.findFirst({
      where: and(
        eq(seoEntries.locationId, location.id),
        eq(seoEntries.page, page.page)
      ),
    })
    if (existing) {
      await db
        .update(seoEntries)
        .set(page)
        .where(eq(seoEntries.id, existing.id))
    } else {
      await db.insert(seoEntries).values({ locationId: location.id, ...page })
    }
  }

  await db
    .update(siteSettings)
    .set({
      googlePlaceId: data.googlePlaceId || null,
      gaMeasurementId: data.gaMeasurementId || null,
      metaPixelId: data.metaPixelId || null,
      gtmContainerId: data.gtmContainerId || null,
      faviconUrl: data.faviconUrl || null,
      ogImageUrl: data.ogImageUrl || null,
    })
    .where(eq(siteSettings.locationId, location.id))

  return OK
}
