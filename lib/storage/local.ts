import "server-only"

import { mkdir, rm, writeFile } from "node:fs/promises"
import { dirname, join, normalize, sep } from "node:path"

const UPLOADS_DIR = join(process.cwd(), "public", "uploads")
const PUBLIC_PREFIX = "/uploads"

const LOCAL_UPLOAD_ROUTE = "/api/admin/media"

function publicUrl(key: string): string {
  return `${PUBLIC_PREFIX}/${key}`
}

export function keyFromUrl(url: string): string | null {
  const prefix = `${PUBLIC_PREFIX}/`
  return url.startsWith(prefix) ? url.slice(prefix.length) : null
}

function resolveSafe(key: string): string {
  const target = normalize(join(UPLOADS_DIR, key))
  if (target !== UPLOADS_DIR && !target.startsWith(UPLOADS_DIR + sep)) {
    throw new Error("Invalid upload key.")
  }
  return target
}

export async function writeObject(
  key: string,
  body: Uint8Array
): Promise<void> {
  const target = resolveSafe(key)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, body)
}

export function createLocalUpload(key: string): {
  uploadUrl: string
  url: string
} {
  return { uploadUrl: `${LOCAL_UPLOAD_ROUTE}/${key}`, url: publicUrl(key) }
}

export async function uploadObject(
  key: string,
  body: Uint8Array
): Promise<string> {
  await writeObject(key, body)
  return publicUrl(key)
}

export async function deleteObject(key: string): Promise<void> {
  await rm(resolveSafe(key), { force: true })
}
