// Baloona ships Hebrew (default) and English. Keeping the supported list in one
// place makes it easy to add more languages later.
const locales = ["he", "en"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "he"

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value)
}

/** Writing direction for a locale — Hebrew is RTL, everything else LTR. */
export function localeDir(locale: Locale): "rtl" | "ltr" {
  return locale === "he" ? "rtl" : "ltr"
}
