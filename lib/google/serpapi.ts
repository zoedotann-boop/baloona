import "server-only"

import { serpApiKey } from "@/lib/env"

export interface GooglePlaceReview {
  externalId: string
  authorName: string
  rating: number
  text: string
  publishedAt: Date
}

interface SerpApiResponse {
  error?: string
  reviews?: {
    review_id?: string
    rating?: number
    iso_date?: string
    snippet?: string
    extracted_snippet?: { original?: string }
    user?: { name?: string }
  }[]
}

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
