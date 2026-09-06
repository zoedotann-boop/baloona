import "server-only"

import { headers } from "next/headers"

export async function siteOrigin(): Promise<string> {
  const configured = process.env.BETTER_AUTH_URL
  if (configured) return configured.replace(/\/+$/, "")

  const headerList = await headers()
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host")
  const proto = headerList.get("x-forwarded-proto") ?? "https"
  return `${proto}://${host}`
}
