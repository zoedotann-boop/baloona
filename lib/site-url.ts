import "server-only"

import { headers } from "next/headers"

/**
 * Absolute origin of the current deployment (no trailing slash), for building
 * links a third party must call back into — PayMe's `sale_callback_url` and
 * `sale_return_url`. Prefers the configured `BETTER_AUTH_URL`; otherwise derives
 * it from the incoming request so it works on whatever host Conductor/dev picks.
 */
export async function siteOrigin(): Promise<string> {
  const configured = process.env.BETTER_AUTH_URL
  if (configured) return configured.replace(/\/+$/, "")

  const headerList = await headers()
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host")
  const proto = headerList.get("x-forwarded-proto") ?? "https"
  return `${proto}://${host}`
}
