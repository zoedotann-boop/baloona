"use server"

import { asc, eq } from "drizzle-orm"
import { z } from "zod"

import { requireLocationAccess } from "@/lib/admin/access"
import { toReviewDraft, type ReviewDraft } from "@/lib/admin/drafts"
import { db } from "@/lib/db"
import { reviews, siteSettings } from "@/lib/db/schema"
import { syncLocationReviews } from "@/lib/google/sync-reviews"

const schema = z.object({ slug: z.string().min(1) })

export type SyncResult =
  | { ok: true; imported: number; updated: number; reviews: ReviewDraft[] }
  | { ok: false; error: string }

/**
 * The admin's "sync now" button.
 *
 * It publishes exactly what the nightly cron would: on a branch with automatic
 * sync off, imports arrive unpublished for an editor to approve, and on one
 * that opted in, 4-star-and-up reviews go live immediately. Pressing the button
 * should never produce a different site than waiting for the job would.
 *
 * The sync writes straight to the database, which would leave the open form
 * showing a stale list — so the refreshed rows come back with the result and
 * the table re-renders on what was actually imported.
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

  const result = await syncLocationReviews({
    locationId: location.id,
    placeId: settings.googlePlaceId,
    autoPublish: settings.googleReviewsAutoSync,
  })
  if (!result.ok) return result

  const rows = await db.query.reviews.findMany({
    where: eq(reviews.locationId, location.id),
    orderBy: (row) => [asc(row.sortOrder)],
  })

  return { ...result, reviews: rows.map(toReviewDraft) }
}
