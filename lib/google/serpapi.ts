import "server-only"

import { serpApiKey } from "@/lib/env"

export interface GooglePlaceReview {
  /** Stable Google id, used to upsert instead of duplicating on re-sync. */
  externalId: string
  authorName: string
  rating: number
  text: string
  publishedAt: Date
}

interface SerpApiResponse {
  /** SerpApi reports failures in the body, including on a 200. */
  error?: string
  reviews?: {
    review_id?: string
    rating?: number
    iso_date?: string
    snippet?: string
    /** The review as written, when Google served a translation instead. */
    extracted_snippet?: { original?: string }
    user?: { name?: string }
  }[]
}

/**
 * Fetch a venue's Google reviews through SerpApi's Google Maps Reviews API.
 *
 * SerpApi rather than Google's own Places API: Places returns at most five
 * reviews and needs a billed Google Cloud project, while this takes the same
 * Place ID we already store and returns the newest eight.
 *
 * Deliberately one request and no `serpapi_pagination` follow-up. SerpApi bills
 * per search and rejects `num` on a first page ("It always returns 8 results"),
 * so a branch costs exactly one search per sync — which is what keeps the
 * nightly cron inside the free tier.
 */
export async function fetchPlaceReviews(
  placeId: string
): Promise<
  { ok: true; reviews: GooglePlaceReview[] } | { ok: false; error: string }
> {
  const apiKey = serpApiKey()
  if (!apiKey) return { ok: false, error: "missing-key" }

  const query = new URLSearchParams({
    engine: "google_maps_reviews",
    place_id: placeId,
    // Hebrew is the source language; `sync-reviews` writes into `text.he`.
    hl: "he",
    sort_by: "newestFirst",
    api_key: apiKey,
  })

  try {
    const response = await fetch(`https://serpapi.com/search.json?${query}`, {
      cache: "no-store",
    })

    const data = (await response
      .json()
      .catch(() => null)) as SerpApiResponse | null

    if (data?.error) return { ok: false, error: data.error }
    if (!response.ok) return { ok: false, error: `HTTP ${response.status}` }

    const reviews = (data?.reviews ?? [])
      .map((review) => ({
        externalId: review.review_id ?? "",
        authorName: review.user?.name ?? "",
        // Ratings arrive as floats (`5.0`) but the column is a smallint.
        rating: Math.min(5, Math.max(1, Math.round(review.rating ?? 5))),
        text: review.extracted_snippet?.original ?? review.snippet ?? "",
        publishedAt: review.iso_date ? new Date(review.iso_date) : new Date(),
      }))
      .filter((review) => review.externalId && review.text)

    return { ok: true, reviews }
  } catch (error) {
    return { ok: false, error: (error as Error).message }
  }
}
