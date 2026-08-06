import { and, eq } from "drizzle-orm"
import { NextResponse, type NextRequest } from "next/server"

import { getAdminUser } from "@/lib/admin/access"
import { db } from "@/lib/db"
import { locationMembers, locations } from "@/lib/db/schema"
import { usingLocalStorage } from "@/lib/storage"
import { writeObject } from "@/lib/storage/local"

/**
 * Receives a browser upload for the local-disk storage fallback.
 *
 * R2's presigned PUT goes straight to Cloudflare; the local backend has no such
 * URL, so it points the browser here instead. The endpoint mirrors that flow's
 * authorization — an admin with access to the branch named in the key — since,
 * unlike a presigned URL, a same-origin route is reachable by any caller.
 */

const FOLDERS = new Set(["gallery", "hero", "steps", "branding"])
const SEGMENT = /^[a-zA-Z0-9._-]+$/
const MAX_BYTES = 10 * 1024 * 1024

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  // Only the dev disk fallback serves this route; R2 and production never do.
  if (!usingLocalStorage()) {
    return NextResponse.json({ error: "not-found" }, { status: 404 })
  }

  const user = await getAdminUser()
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const { key: segments } = await params
  const [slug, folder, fileName, ...rest] = segments
  const validKey =
    rest.length === 0 &&
    !!slug &&
    !!fileName &&
    FOLDERS.has(folder ?? "") &&
    SEGMENT.test(slug) &&
    SEGMENT.test(fileName)
  if (!validKey) {
    return NextResponse.json({ error: "invalid-key" }, { status: 400 })
  }

  const location = await db.query.locations.findFirst({
    where: eq(locations.slug, slug),
  })
  if (!location) {
    return NextResponse.json({ error: "not-found" }, { status: 404 })
  }
  if (user.role !== "owner") {
    const membership = await db.query.locationMembers.findFirst({
      where: and(
        eq(locationMembers.userId, user.id),
        eq(locationMembers.locationId, location.id)
      ),
    })
    if (!membership) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 })
    }
  }

  if (!(request.headers.get("content-type") ?? "").startsWith("image/")) {
    return NextResponse.json({ error: "unsupported" }, { status: 415 })
  }

  const body = new Uint8Array(await request.arrayBuffer())
  if (body.byteLength === 0) {
    return NextResponse.json({ error: "empty" }, { status: 400 })
  }
  if (body.byteLength > MAX_BYTES) {
    return NextResponse.json({ error: "too-large" }, { status: 413 })
  }

  await writeObject(segments.join("/"), body)
  return NextResponse.json({ ok: true })
}
