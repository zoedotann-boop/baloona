import "server-only"

import { r2Config } from "@/lib/env"

/**
 * Cloudflare R2 (S3-compatible) media storage.
 *
 * Browser uploads go straight to R2 through a presigned PUT so image bytes
 * never pass through the Next.js server. Everything R2 stores is public — the
 * bucket is served from `R2_PUBLIC_BASE_URL` — so keys are prefixed per
 * location and suffixed with a random id rather than kept secret.
 *
 * The AWS SDK is loaded on demand rather than imported at the top of the
 * module. This file is reachable from the server actions behind the public
 * contact form and the admin's image fields, so a static import would drag the
 * whole SDK into every route's module graph — which is minutes of work for the
 * dev compiler on a page that never uploads anything.
 */

const UPLOAD_URL_TTL_SECONDS = 60 * 5

async function client() {
  const config = r2Config()
  if (!config) throw new Error("R2 is not configured. See .env.example.")

  const { S3Client } = await import("@aws-sdk/client-s3")
  return {
    config,
    s3: new S3Client({
      region: "auto",
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    }),
  }
}

/** Public URL for a stored object key. */
function publicUrl(key: string): string {
  const config = r2Config()
  return config ? `${config.publicBaseUrl}/${key}` : ""
}

/** Presigned PUT the browser uploads to, plus the URL to store afterwards. */
export async function createPresignedUpload(
  key: string,
  contentType: string
): Promise<{ uploadUrl: string; url: string }> {
  const { config, s3 } = await client()
  const [{ PutObjectCommand }, { getSignedUrl }] = await Promise.all([
    import("@aws-sdk/client-s3"),
    import("@aws-sdk/s3-request-presigner"),
  ])

  const uploadUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: UPLOAD_URL_TTL_SECONDS }
  )

  return { uploadUrl, url: publicUrl(key) }
}

/** Server-side upload, used for generated files such as signature images. */
export async function uploadObject(
  key: string,
  contentType: string,
  body: Uint8Array
): Promise<string> {
  const { config, s3 } = await client()
  const { PutObjectCommand } = await import("@aws-sdk/client-s3")

  await s3.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      ContentType: contentType,
      Body: body,
    })
  )
  return publicUrl(key)
}

export async function deleteObject(key: string): Promise<void> {
  if (!r2Config()) return
  const { config, s3 } = await client()
  const { DeleteObjectCommand } = await import("@aws-sdk/client-s3")

  await s3.send(new DeleteObjectCommand({ Bucket: config.bucket, Key: key }))
}

/** Object key for a public URL produced by {@link publicUrl}, if it is ours. */
export function keyFromUrl(url: string): string | null {
  const config = r2Config()
  if (!config || !url.startsWith(`${config.publicBaseUrl}/`)) return null
  return url.slice(config.publicBaseUrl.length + 1)
}
