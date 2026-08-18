import "server-only"

import { and, eq } from "drizzle-orm"

import { translateValues } from "@/lib/ai/translate"
import { db } from "@/lib/db"
import { reviews } from "@/lib/db/schema"

import { fetchPlaceReviews } from "./serpapi"

export type ReviewSyncResult =
  { ok: true; imported: number; updated: number } | { ok: false; error: string }

/**
 * Ratings the automatic sync is allowed to publish on its own. Anything below
 * lands unpublished and waits for an editor — an unattended job should never
 * put a complaint on the branch's home page.
 */
const AUTO_PUBLISH_MIN_RATING = 4

/**
 * Draft English for reviews that need it, in one Gemini call for the batch.
 *
 * Best-effort by design: a review arrives in Hebrew, and English is a nicety.
 * Without a Gemini key — or if the call fails — this returns `null` and the
 * sync stores the reviews with English untouched, exactly as a hand-written
 * review starts out. `pickLocale` then falls back to Hebrew, so the site reads
 * correctly either way. Nothing here is allowed to fail a sync.
 */
async function draftEnglish(texts: string[]): Promise<string[] | null> {
  if (texts.length === 0) return null

  const result = await translateValues(texts, "he", "en")
  return result.ok ? result.values : null
}

/**
 * Pull one branch's Google reviews into the `review` table.
 *
 * Reviews are matched on Google's own id, so a re-sync refreshes wording and
 * ratings in place. Only new rows get an `isPublished` value: once a review
 * exists, whether it appears on the site is the editor's decision and no
 * later sync overrules it.
 *
 * `autoPublish` is what separates the two callers. The admin's "sync now"
 * button imports everything unpublished so the editor curates; the nightly
 * cron publishes {@link AUTO_PUBLISH_MIN_RATING}-star reviews and up, because
 * nobody is standing by to approve them.
 *
 * Google serves the review in Hebrew, so {@link draftEnglish} fills the English
 * side on the way in and the reviews section reads in both locales without an
 * editor retyping anything.
 */
export async function syncLocationReviews({
  locationId,
  placeId,
  autoPublish = false,
}: {
  locationId: string
  placeId: string
  autoPublish?: boolean
}): Promise<ReviewSyncResult> {
  const result = await fetchPlaceReviews(placeId)
  if (!result.ok) return result

  const existing = await db.query.reviews.findMany({
    where: and(
      eq(reviews.locationId, locationId),
      eq(reviews.source, "google")
    ),
  })
  const byExternalId = new Map(
    existing.flatMap((review) =>
      review.externalId ? [[review.externalId, review] as const] : []
    )
  )

  const fresh = result.reviews.filter(
    (review) => !byExternalId.has(review.externalId)
  )

  // A review whose Hebrew changed needs its English redrafted too — leaving the
  // old translation in place would have the two languages saying different
  // things. Everything that needs English goes into one batched call.
  const rephrased = result.reviews.filter((review) => {
    const match = byExternalId.get(review.externalId)
    return match !== undefined && match.text.he !== review.text
  })

  const pending = [...fresh, ...rephrased]
  const drafted = await draftEnglish(pending.map((review) => review.text))
  const englishByExternalId = new Map(
    drafted
      ? pending.map(
          (review, index) => [review.externalId, drafted[index]] as const
        )
      : []
  )

  for (const review of result.reviews) {
    const match = byExternalId.get(review.externalId)
    if (!match) continue

    await db
      .update(reviews)
      .set({
        authorName: review.authorName,
        rating: review.rating,
        text: {
          ...match.text,
          he: review.text,
          // Falsy rather than nullish: a failed or empty draft must keep the
          // English already stored, not blank it.
          en: englishByExternalId.get(review.externalId) || match.text.en,
        },
        publishedAt: review.publishedAt,
      })
      .where(eq(reviews.id, match.id))
  }

  if (fresh.length > 0) {
    await db.insert(reviews).values(
      fresh.map((review) => ({
        locationId,
        authorName: review.authorName,
        rating: review.rating,
        text: {
          he: review.text,
          en: englishByExternalId.get(review.externalId) ?? "",
        },
        source: "google" as const,
        externalId: review.externalId,
        publishedAt: review.publishedAt,
        isPublished: autoPublish && review.rating >= AUTO_PUBLISH_MIN_RATING,
      }))
    )
  }

  return {
    ok: true,
    imported: fresh.length,
    updated: result.reviews.length - fresh.length,
  }
}
