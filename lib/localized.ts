import { defaultLocale, type Locale } from "@/i18n/routing"
import type { Localized, LocalizedList } from "@/lib/db/schema/_shared"

export type { Localized, LocalizedList }

/**
 * Read a translatable value for the active locale, falling back to Hebrew.
 *
 * Hebrew is the source language every editor fills in first; other locales are
 * drafted later (by hand or with the AI button), so a partially translated site
 * should read as Hebrew rather than as a blank.
 */
export function pickLocale(
  value: Localized | null | undefined,
  locale: Locale
): string {
  if (!value) return ""
  return value[locale]?.trim() || value[defaultLocale] || ""
}

/** {@link pickLocale} for a translatable list of lines. */
export function pickLocaleList(
  value: LocalizedList | null | undefined,
  locale: Locale
): string[] {
  if (!value) return []
  const lines = value[locale]
  if (lines?.some((line) => line.trim())) return lines
  return value[defaultLocale] ?? []
}

/** An empty translatable value, for new rows created in the admin. */
export function emptyLocalized(): Localized {
  return { he: "", en: "" }
}

/** Prices are whole shekels in the database; the currency is added on render. */
export function formatPrice(amount: number, locale: Locale): string {
  return `${amount.toLocaleString(locale === "he" ? "he-IL" : "en-US")} ₪`
}

/** Per-entry price for a package, e.g. 650₪ / 20 → "32.5 ₪" (one decimal). */
export function formatPerEntry(
  amount: number,
  entries: number,
  locale: Locale
): string {
  const perEntry = entries > 0 ? amount / entries : 0
  const formatted = perEntry.toLocaleString(
    locale === "he" ? "he-IL" : "en-US",
    { maximumFractionDigits: 1 }
  )
  return `${formatted} ₪`
}
