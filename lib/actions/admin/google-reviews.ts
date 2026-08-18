"use server"

import { eq } from "drizzle-orm"
import { z } from "zod"

import { requireLocationAccess } from "@/lib/admin/access"
import { db } from "@/lib/db"
import { siteSettings } from "@/lib/db/schema"
import {
  syncLocationReviews,
  type ReviewSyncResult,
} from "@/lib/google/sync-reviews"

const schema = z.object({ slug: z.string().min(1) })

export type SyncResult = ReviewSyncResult

/**
 * The admin's "sync now" button.
 *
 * Imported reviews arrive unpublished: an editor decides what appears on the
 * site, and Google is only a source, not the publisher. The nightly cron
 * (`/api/cron/google-reviews`) runs the same sync with auto-publish on for
 * branches that opted in.
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

  return syncLocationReviews({
    locationId: location.id,
    placeId: settings.googlePlaceId,
  })
}
