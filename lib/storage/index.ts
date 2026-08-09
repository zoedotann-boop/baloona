import "server-only"

import { blobToken } from "@/lib/env"

import * as blob from "./blob"
import * as local from "./local"

/**
 * Media storage facade.
 *
 * Uploads go to Vercel Blob when it is configured; otherwise, in development,
 * they fall back to local disk so the admin's image fields work without any
 * external setup. In production without Blob there is no backend and uploads
 * report themselves as unconfigured — production is expected to set
 * `BLOB_READ_WRITE_TOKEN`.
 */

/** True when uploads fall back to local disk (development, no Blob). */
export function usingLocalStorage(): boolean {
  return !blobToken() && process.env.NODE_ENV !== "production"
}

export function isStorageConfigured(): boolean {
  return Boolean(blobToken()) || usingLocalStorage()
}

// The substring "not configured" is what the image field matches to show its
// "storage not configured" message, so keep it in the thrown text.
const NOT_CONFIGURED = "Storage is not configured. See .env.example."

/**
 * How the browser should upload a file for a given key.
 *
 * The two backends upload differently, so the client is told which path to
 * take: Blob's client `upload()` handshake needs only the `pathname` (the route
 * signs a token and hands back the final URL), while the local backend has no
 * presigned URL, so the browser PUTs the bytes to our own route.
 */
export type UploadTarget =
  | { mode: "blob"; pathname: string }
  | { mode: "local"; uploadUrl: string; url: string }

export function createUploadTarget(key: string): UploadTarget {
  if (blobToken()) return { mode: "blob", pathname: key }
  if (usingLocalStorage())
    return { mode: "local", ...local.createLocalUpload(key) }
  throw new Error(NOT_CONFIGURED)
}

/** Server-side upload, used for generated files such as signature images. */
export async function uploadObject(
  key: string,
  contentType: string,
  body: Uint8Array
): Promise<string> {
  if (blobToken()) return blob.uploadObject(key, contentType, body)
  if (usingLocalStorage()) return local.uploadObject(key, body)
  throw new Error(NOT_CONFIGURED)
}

export async function deleteObject(key: string): Promise<void> {
  if (blobToken()) return blob.deleteObject(key)
  if (usingLocalStorage()) return local.deleteObject(key)
}

/** Object key behind a stored URL, whichever backend produced it. */
export function keyFromUrl(url: string): string | null {
  return blob.keyFromUrl(url) ?? local.keyFromUrl(url)
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
