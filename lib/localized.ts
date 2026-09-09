import { defaultLocale, type Locale } from "@/i18n/routing"
import type { Localized, LocalizedList } from "@/lib/db/schema/_shared"

export type { Localized, LocalizedList }

export function pickLocale(
  value: Localized | null | undefined,
  locale: Locale
): string {
  if (!value) return ""
  return value[locale]?.trim() || value[defaultLocale] || ""
}

export function pickLocaleList(
  value: LocalizedList | null | undefined,
  locale: Locale
): string[] {
  if (!value) return []
  const lines = value[locale]
  if (lines?.some((line) => line.trim())) return lines
  return value[defaultLocale] ?? []
}

export function emptyLocalized(): Localized {
  return { he: "", en: "" }
}

export function formatPrice(amount: number, locale: Locale): string {
  return `${amount.toLocaleString(locale === "he" ? "he-IL" : "en-US")} ₪`
}

export function formatDateTime(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "he" ? "he-IL" : "en-US", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Asia/Jerusalem",
  }).format(date)
}

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
