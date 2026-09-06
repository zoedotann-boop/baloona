import "server-only"

import { and, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { locationMembers, locations } from "@/lib/db/schema"

import { getAdminUser } from "./access"

export const MEDIA_FOLDERS = [
  "gallery",
  "reviews",
  "hero",
  "steps",
  "branding",
] as const
type MediaFolder = (typeof MEDIA_FOLDERS)[number]

const FOLDER_SET = new Set<string>(MEDIA_FOLDERS)
const SEGMENT = /^[a-zA-Z0-9._-]+$/

export interface MediaKey {
  slug: string
  folder: MediaFolder
  fileName: string
}

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
