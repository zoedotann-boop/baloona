import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin()

type RemotePatterns = NonNullable<NextConfig["images"]>["remotePatterns"]

/**
 * Images uploaded through the admin are served from the R2 bucket, so
 * `next/image` has to be told that host is allowed. The bucket URL is
 * deployment configuration rather than a constant, so it is derived from the
 * same env var the uploader uses.
 */
function mediaRemotePatterns(): RemotePatterns {
  const base = process.env.R2_PUBLIC_BASE_URL
  if (!base) return []
  try {
    const { protocol, hostname } = new URL(base)
    return [
      { protocol: protocol.replace(":", "") as "http" | "https", hostname },
    ]
  } catch {
    return []
  }
}

const nextConfig: NextConfig = {
  // Pin the workspace root: Turbopack otherwise walks up to a stray lockfile in
  // a parent directory and infers the wrong root.
  turbopack: { root: dirname(fileURLToPath(import.meta.url)) },
  images: { remotePatterns: mediaRemotePatterns() },
  // The upload path is the only thing that needs the AWS SDK, and bundling it
  // costs far more than requiring it at runtime. Next externalizes
  // `@aws-sdk/client-s3` by default but not the presigner.
  serverExternalPackages: [
    "@aws-sdk/client-s3",
    "@aws-sdk/s3-request-presigner",
  ],
}

export default withNextIntl(nextConfig)
