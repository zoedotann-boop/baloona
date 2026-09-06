import type { reviews, ReviewSource } from "@/lib/db/schema"
import type { Localized, LocalizedList } from "@/lib/localized"

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
  text: string
  isPublished: boolean
  publishedAt: string
  source: ReviewSource
}

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
