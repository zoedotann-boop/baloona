import "server-only"

import { and, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { reviews } from "@/lib/db/schema"

import { fetchPlaceReviews } from "./serpapi"

export type ReviewSyncResult =
  { ok: true; imported: number; updated: number } | { ok: false; error: string }

const AUTO_PUBLISH_MIN_RATING = 4

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
