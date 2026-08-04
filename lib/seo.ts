import "server-only"

import type { Metadata } from "next"
import { getLocale } from "next-intl/server"

import { type Locale } from "@/i18n/routing"
import { getLocationChrome, getSeoEntry } from "@/lib/db/queries/site"
import type { SeoPage } from "@/lib/db/schema"
import { pickLocale } from "@/lib/localized"

/**
 * Metadata for one page of one branch, from the SEO rows the admin edits.
 *
 * Each branch owns its title, description, share image and favicon, so two
 * venues never compete for the same search result.
 */
export async function buildPageMetadata(
  slug: string,
  page: SeoPage
): Promise<Metadata> {
  const chrome = await getLocationChrome(slug)
  if (!chrome) return {}

  const locale = (await getLocale()) as Locale
  const entry = await getSeoEntry(chrome.id, page)

  const title =
    pickLocale(entry?.title, locale) || pickLocale(chrome.name, locale)
  const description = pickLocale(entry?.description, locale)
  const keywords = pickLocale(entry?.keywords, locale)
  const ogImage = chrome.settings?.ogImageUrl
  const favicon = chrome.settings?.faviconUrl

  return {
    title,
    description: description || undefined,
    keywords: keywords ? keywords.split(",").map((k) => k.trim()) : undefined,
    icons: favicon ? { icon: favicon } : undefined,
    openGraph: {
      title,
      description: description || undefined,
      images: ogImage ? [ogImage] : undefined,
      type: "website",
    },
  }
}
