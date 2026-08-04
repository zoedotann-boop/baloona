"use server"

import { and, eq } from "drizzle-orm"
import { z } from "zod"

import { requireLocationAccess } from "@/lib/admin/access"
import { db } from "@/lib/db"
import { reviews, siteSettings } from "@/lib/db/schema"
import { fetchPlaceReviews } from "@/lib/google/places"

const schema = z.object({ slug: z.string().min(1) })

export type SyncResult =
  { ok: true; imported: number; updated: number } | { ok: false; error: string }

/**
 * Pull the branch's Google reviews into the reviews list.
 *
 * Reviews are matched on Google's own id, so a re-sync refreshes wording and
 * ratings in place. Imported reviews arrive unpublished: an editor decides what
 * appears on the site, and Google is only a source, not the publisher.
 */
export async function syncGoogleReviews(
  input: z.input<typeof schema>
): Promise<SyncResult> {
  const { location } = await requireLocationAccess(input.slug)

  const parsed = schema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }

  const settings = await db.query.siteSettings.findFirst({
    where: eq(siteSettings.locationId, location.id),
  })
  if (!settings?.googlePlaceId) return { ok: false, error: "missing-place-id" }

  const result = await fetchPlaceReviews(settings.googlePlaceId)
  if (!result.ok) return result

  let imported = 0
  let updated = 0

  for (const review of result.reviews) {
    const existing = await db.query.reviews.findFirst({
      where: and(
        eq(reviews.locationId, location.id),
        eq(reviews.externalId, review.externalId)
      ),
    })

    if (existing) {
      await db
        .update(reviews)
        .set({
          authorName: review.authorName,
          rating: review.rating,
          text: { ...existing.text, he: review.text },
          publishedAt: review.publishedAt,
        })
        .where(eq(reviews.id, existing.id))
      updated++
    } else {
      await db.insert(reviews).values({
        locationId: location.id,
        authorName: review.authorName,
        rating: review.rating,
        text: { he: review.text, en: "" },
        source: "google",
        externalId: review.externalId,
        publishedAt: review.publishedAt,
        isPublished: false,
      })
      imported++
    }
  }

  return { ok: true, imported, updated }
}
