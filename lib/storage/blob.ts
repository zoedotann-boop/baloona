import "server-only"

import { blobToken } from "@/lib/env"

/**
 * Vercel Blob media storage.
 *
 * Browser uploads go straight to Blob: the admin's image field calls the SDK's
 * client `upload()`, which fetches a short-lived token from the
 * `app/api/admin/media/upload` route (see {@link file://../../app/api/admin/media/upload/route.ts})
 * and PUTs the bytes to Blob directly, so image data never round-trips through
 * a Function and never hits the 4.5 MB request-body limit. This module only
 * covers the server-side operations — generated uploads (signatures) and
 * deletes.
 *
 * Everything is stored with public access and served from the store's
 * `*.public.blob.vercel-storage.com` host. The SDK is loaded on demand rather
 * than imported at the top: this file is reachable from the public contact
 * form's server action, and a static import would drag the SDK into every
 * route that touches storage.
 */

/** Server-side upload, used for generated files such as signature images. */
export async function uploadObject(
  key: string,
  contentType: string,
  body: Uint8Array
): Promise<string> {
  const { put } = await import("@vercel/blob")
  const { url } = await put(key, Buffer.from(body), {
    access: "public",
    contentType,
    // Keys already carry a random id from `buildObjectKey`, so the pathname is
    // collision-free without Blob appending its own suffix.
    addRandomSuffix: false,
    token: blobToken(),
  })
  return url
}

export async function deleteObject(url: string): Promise<void> {
  const { del } = await import("@vercel/blob")
  await del(url, { token: blobToken() })
}

/**
 * Object identifier for a stored URL, if Blob produced it. `del()` takes the
 * URL itself, so — unlike a bucket key — the identifier is the URL verbatim.
 * Editor-pasted URLs (external assets, `/public`) are left untouched.
 */
export function keyFromUrl(url: string): string | null {
  return url.includes(".public.blob.vercel-storage.com/") ? url : null
}
