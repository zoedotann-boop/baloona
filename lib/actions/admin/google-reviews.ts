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
 * Imported reviews arrive unpublished: an editor decides what appears on the
 * site, and Google is only a source, not the publisher. The nightly cron
 * (`/api/cron/google-reviews`) runs the same sync with auto-publish on for
 * branches that opted in.
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
  })
  if (!result.ok) return result

  const rows = await db.query.reviews.findMany({
    where: eq(reviews.locationId, location.id),
    orderBy: (row) => [asc(row.sortOrder)],
  })

  return { ...result, reviews: rows.map(toReviewDraft) }
}
