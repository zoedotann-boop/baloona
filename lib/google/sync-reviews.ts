import "server-only"

import { and, eq } from "drizzle-orm"

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
 * The review text is stored exactly as its author wrote it and never
 * translated — see the `text` column in `lib/db/schema/content.ts`.
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

  for (const review of result.reviews) {
    const match = byExternalId.get(review.externalId)
    if (!match) continue

    await db
      .update(reviews)
      .set({
        authorName: review.authorName,
        rating: review.rating,
        text: review.text,
        publishedAt: review.publishedAt,
      })
      .where(eq(reviews.id, match.id))
  }

  const fresh = result.reviews.filter(
    (review) => !byExternalId.has(review.externalId)
  )

  if (fresh.length > 0) {
    await db.insert(reviews).values(
      fresh.map((review) => ({
        locationId,
        authorName: review.authorName,
        rating: review.rating,
        text: review.text,
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
