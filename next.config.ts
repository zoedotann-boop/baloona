import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  // Pin the workspace root: Turbopack otherwise walks up to a stray lockfile in
  // a parent directory and infers the wrong root.
  turbopack: { root: dirname(fileURLToPath(import.meta.url)) },
  // Admin uploads are served from the Blob store's public host, whose
  // subdomain is the store id — unknown at build time, so match any store.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
}

export default withNextIntl(nextConfig)
