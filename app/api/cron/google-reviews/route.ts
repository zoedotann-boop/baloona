import { eq } from "drizzle-orm"
import { NextResponse, type NextRequest } from "next/server"

import { db } from "@/lib/db"
import { locations, siteSettings } from "@/lib/db/schema"
import { cronSecret } from "@/lib/env"
import {
  syncLocationReviews,
  type ReviewSyncResult,
} from "@/lib/google/sync-reviews"

/**
 * Nightly Google reviews sync (see `vercel.json` for the schedule).
 *
 * Which branches run is data, not code: a branch takes part once it has a
 * Google Place ID and "סנכרון אוטומטי" turned on in ניהול ביקורות. Today that
 * is Kiryat Ono alone; adding a branch is a toggle, not a deploy.
 *
 * One branch failing must not stop the rest, so every outcome — imported,
 * refused by Google, or thrown — is collected and returned for the Vercel log.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const secret = cronSecret()
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const branches = await db
    .select({
      id: locations.id,
      slug: locations.slug,
      placeId: siteSettings.googlePlaceId,
    })
    .from(siteSettings)
    .innerJoin(locations, eq(locations.id, siteSettings.locationId))
    .where(eq(siteSettings.googleReviewsAutoSync, true))

  const synced = await Promise.all(
    branches.map(
      async ({
        id,
        slug,
        placeId,
      }): Promise<{ slug: string } & ReviewSyncResult> => {
        // A branch can be toggled on before anyone fills in its Place ID.
        if (!placeId) return { slug, ok: false, error: "missing-place-id" }

        try {
          return {
            slug,
            ...(await syncLocationReviews({
              locationId: id,
              placeId,
              autoPublish: true,
            })),
          }
        } catch (error) {
          return { slug, ok: false, error: (error as Error).message }
        }
      }
    )
  )

  return NextResponse.json({ synced })
}
