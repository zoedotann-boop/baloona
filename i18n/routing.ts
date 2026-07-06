// Baloona currently ships a single locale. Keeping the supported list in one
// place makes it easy to add more languages later.
const locales = ["he"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "he"
