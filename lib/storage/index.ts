import "server-only"

import { r2Config } from "@/lib/env"

import * as local from "./local"
import * as r2 from "./r2"

/**
 * Media storage facade.
 *
 * Uploads go to Cloudflare R2 when it is configured; otherwise, in development,
 * they fall back to local disk so the admin's image fields work without any
 * external setup. In production without R2 there is no backend and uploads
 * report themselves as unconfigured — production is expected to set R2.
 */

/** True when uploads fall back to local disk (development, no R2). */
export function usingLocalStorage(): boolean {
  return !r2Config() && process.env.NODE_ENV !== "production"
}

export function isStorageConfigured(): boolean {
  return r2Config() !== null || usingLocalStorage()
}

// The substring "not configured" is what the image field matches to show its
// "storage not configured" message, so keep it in the thrown text.
const NOT_CONFIGURED = "Storage is not configured. See .env.example."

/** Presigned PUT (or its local equivalent) plus the URL to store afterwards. */
export async function createPresignedUpload(
  key: string,
  contentType: string
): Promise<{ uploadUrl: string; url: string }> {
  if (r2Config()) return r2.createPresignedUpload(key, contentType)
  if (usingLocalStorage()) return local.createPresignedUpload(key)
  throw new Error(NOT_CONFIGURED)
}

/** Server-side upload, used for generated files such as signature images. */
export async function uploadObject(
  key: string,
  contentType: string,
  body: Uint8Array
): Promise<string> {
  if (r2Config()) return r2.uploadObject(key, contentType, body)
  if (usingLocalStorage()) return local.uploadObject(key, body)
  throw new Error(NOT_CONFIGURED)
}

export async function deleteObject(key: string): Promise<void> {
  if (r2Config()) return r2.deleteObject(key)
  if (usingLocalStorage()) return local.deleteObject(key)
}

/** Object key behind a stored URL, whichever backend produced it. */
export function keyFromUrl(url: string): string | null {
  return r2.keyFromUrl(url) ?? local.keyFromUrl(url)
}

/** A collision-free object key under a location's folder. */
export function buildObjectKey(
  locationSlug: string,
  folder: string,
  fileName: string
): string {
  const safeName = fileName
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return `${locationSlug}/${folder}/${crypto.randomUUID()}-${safeName || "file"}`
}
