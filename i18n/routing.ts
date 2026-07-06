// Baloona ships Hebrew (default) and English. Keeping the supported list in one
// place makes it easy to add more languages later.
export const locales = ["he", "en"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "he"

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value)
}
