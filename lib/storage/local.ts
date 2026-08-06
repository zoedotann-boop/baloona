import "server-only"

import { mkdir, rm, writeFile } from "node:fs/promises"
import { dirname, join, normalize, sep } from "node:path"

/**
 * Local-disk media backend — the development fallback used when Cloudflare R2
 * is not configured (see `../storage`).
 *
 * Files land under `public/uploads/<key>` and Next serves them at
 * `/uploads/<key>`, so the admin's image fields work with zero external setup.
 * Unlike R2 there is no presigned URL, so the browser PUTs straight to the
 * `app/api/admin/media/[...key]` route, which then calls {@link writeObject}.
 *
 * Not for production: a serverless filesystem is read-only and ephemeral, which
 * is why `../storage` only selects this backend outside production.
 */

const UPLOADS_DIR = join(process.cwd(), "public", "uploads")
const PUBLIC_PREFIX = "/uploads"

/** Base path the browser PUTs an upload to; the key is appended as segments. */
const LOCAL_UPLOAD_ROUTE = "/api/admin/media"

function publicUrl(key: string): string {
  return `${PUBLIC_PREFIX}/${key}`
}

export function keyFromUrl(url: string): string | null {
  const prefix = `${PUBLIC_PREFIX}/`
  return url.startsWith(prefix) ? url.slice(prefix.length) : null
}

/** Resolve a key to an absolute path, refusing anything outside the folder. */
function resolveSafe(key: string): string {
  const target = normalize(join(UPLOADS_DIR, key))
  if (target !== UPLOADS_DIR && !target.startsWith(UPLOADS_DIR + sep)) {
    throw new Error("Invalid upload key.")
  }
  return target
}

/** Write bytes to disk. Shared by the browser PUT route and server uploads. */
export async function writeObject(
  key: string,
  body: Uint8Array
): Promise<void> {
  const target = resolveSafe(key)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, body)
}

/** R2's presigned-upload shape: here the browser PUTs to our own route. */
export function createPresignedUpload(key: string): {
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
