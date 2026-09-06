import "server-only"

import { blobToken } from "@/lib/env"

import * as blob from "./blob"
import * as local from "./local"

export function usingLocalStorage(): boolean {
  return !blobToken() && process.env.NODE_ENV !== "production"
}

export function isStorageConfigured(): boolean {
  return Boolean(blobToken()) || usingLocalStorage()
}

const NOT_CONFIGURED = "Storage is not configured. See .env.example."

export type UploadTarget =
  | { mode: "blob"; pathname: string }
  | { mode: "local"; uploadUrl: string; url: string }

export function createUploadTarget(key: string): UploadTarget {
  if (blobToken()) return { mode: "blob", pathname: key }
  if (usingLocalStorage())
    return { mode: "local", ...local.createLocalUpload(key) }
  throw new Error(NOT_CONFIGURED)
}

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

export function keyFromUrl(url: string): string | null {
  return blob.keyFromUrl(url) ?? local.keyFromUrl(url)
}

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
