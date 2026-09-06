import { eq } from "drizzle-orm"
import { NextResponse, type NextRequest } from "next/server"

import { db } from "@/lib/db"
import { locations, siteSettings } from "@/lib/db/schema"
import { cronSecret } from "@/lib/env"
import {
  syncLocationReviews,
  type ReviewSyncResult,
} from "@/lib/google/sync-reviews"

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
