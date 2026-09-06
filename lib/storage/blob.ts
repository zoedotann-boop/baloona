import "server-only"

import { blobToken } from "@/lib/env"

export async function uploadObject(
  key: string,
  contentType: string,
  body: Uint8Array
): Promise<string> {
  const { put } = await import("@vercel/blob")
  const { url } = await put(key, Buffer.from(body), {
    access: "public",
    contentType,
    addRandomSuffix: false,
    token: blobToken(),
  })
  return url
}

export async function deleteObject(url: string): Promise<void> {
  const { del } = await import("@vercel/blob")
  await del(url, { token: blobToken() })
}

export function keyFromUrl(url: string): string | null {
  return url.includes(".public.blob.vercel-storage.com/") ? url : null
}
