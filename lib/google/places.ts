import "server-only"

import { googlePlacesApiKey } from "@/lib/env"

export interface GooglePlaceReview {
  /** Stable Google id, used to upsert instead of duplicating on re-sync. */
  externalId: string
  authorName: string
  rating: number
  text: string
  publishedAt: Date
}

interface PlacesResponse {
  reviews?: {
    name?: string
    rating?: number
    publishTime?: string
    text?: { text?: string }
    originalText?: { text?: string }
    authorAttribution?: { displayName?: string }
  }[]
}

/**
 * Fetch a venue's Google reviews via the Places API (New).
 *
 * Google returns at most five reviews per place, so this tops up the list an
 * editor curates rather than replacing it — manual reviews are left untouched.
 */
export async function fetchPlaceReviews(
  placeId: string
): Promise<
  { ok: true; reviews: GooglePlaceReview[] } | { ok: false; error: string }
> {
  const apiKey = googlePlacesApiKey()
  if (!apiKey) return { ok: false, error: "missing-key" }

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "reviews",
        },
        cache: "no-store",
      }
    )

    if (!response.ok) return { ok: false, error: `HTTP ${response.status}` }

    const data = (await response.json()) as PlacesResponse
    const reviews = (data.reviews ?? [])
      .map((review) => ({
        externalId: review.name ?? "",
        authorName: review.authorAttribution?.displayName ?? "",
        rating: review.rating ?? 5,
        text: review.originalText?.text ?? review.text?.text ?? "",
        publishedAt: review.publishTime
          ? new Date(review.publishTime)
          : new Date(),
      }))
      .filter((review) => review.externalId && review.text)

    return { ok: true, reviews }
  } catch (error) {
    return { ok: false, error: (error as Error).message }
  }
}
