import "server-only"

import { and, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { locationMembers, locations } from "@/lib/db/schema"

import { getAdminUser } from "./access"

/**
 * Authorization for media upload keys.
 *
 * Uploads are addressed by a `slug/folder/file` key. Both upload entry points —
 * Vercel Blob's token route and the local-disk PUT route — are reachable by any
 * caller, so each parses the key and confirms the signed-in admin may write to
 * the branch it names before letting bytes through.
 */

export const MEDIA_FOLDERS = ["gallery", "hero", "steps", "branding"] as const
type MediaFolder = (typeof MEDIA_FOLDERS)[number]

const FOLDER_SET = new Set<string>(MEDIA_FOLDERS)
const SEGMENT = /^[a-zA-Z0-9._-]+$/

export interface MediaKey {
  slug: string
  folder: MediaFolder
  fileName: string
}

/** Split a `slug/folder/file` key, rejecting anything malformed. */
export function parseMediaKey(key: string): MediaKey | null {
  const parts = key.split("/")
  if (parts.length !== 3) return null
  const [slug, folder, fileName] = parts
  if (
    !slug ||
    !fileName ||
    !FOLDER_SET.has(folder) ||
    !SEGMENT.test(slug) ||
    !SEGMENT.test(fileName)
  ) {
    return null
  }
  return { slug, folder: folder as MediaFolder, fileName }
}

/** Whether the signed-in admin may write to the branch a key names. */
export async function canWriteMediaKey(key: MediaKey): Promise<boolean> {
  const user = await getAdminUser()
  if (!user) return false

  const location = await db.query.locations.findFirst({
    where: eq(locations.slug, key.slug),
  })
  if (!location) return false
  if (user.role === "owner") return true

  const membership = await db.query.locationMembers.findFirst({
    where: and(
      eq(locationMembers.userId, user.id),
      eq(locationMembers.locationId, location.id)
    ),
  })
  return Boolean(membership)
}
