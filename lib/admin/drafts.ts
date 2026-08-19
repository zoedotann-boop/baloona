import type { reviews, ReviewSource } from "@/lib/db/schema"
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

export interface ReviewDraft {
  id?: string
  authorName: string
  rating: number
  /** The author's own words, in their own language. Never translated. */
  text: string
  isPublished: boolean
  /** `YYYY-MM-DD`, what a date input round-trips. */
  publishedAt: string
  source: ReviewSource
}

/**
 * Shape one review row for the reviews form.
 *
 * Shared by the page's first render and by the Google sync's response, so the
 * table an editor sees after syncing is built the same way as the one they
 * arrived on.
 */
export function toReviewDraft(row: typeof reviews.$inferSelect): ReviewDraft {
  return {
    id: row.id,
    authorName: row.authorName,
    rating: row.rating,
    text: row.text,
    isPublished: row.isPublished,
    publishedAt: row.publishedAt.toISOString().slice(0, 10),
    source: row.source,
  }
}
