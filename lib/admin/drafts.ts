import type { Localized, LocalizedList } from "@/lib/localized"

/**
 * Turn nullable database columns into the always-present shapes admin forms
 * bind to. Controlled inputs need `""` rather than `null`, and a translatable
 * field that was never filled still needs a `{ he, en }` object to type into.
 */

export function toLocalized(value: Localized | null | undefined): Localized {
  return { he: value?.he ?? "", en: value?.en ?? "" }
}

export function toLocalizedList(
  value: LocalizedList | null | undefined
): LocalizedList {
  return { he: value?.he ?? [], en: value?.en ?? [] }
}

export function toText(value: string | null | undefined): string {
  return value ?? ""
}
