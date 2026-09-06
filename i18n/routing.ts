const locales = ["he", "en"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "he"

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value)
}

export function localeDir(locale: Locale): "rtl" | "ltr" {
  return locale === "he" ? "rtl" : "ltr"
}
