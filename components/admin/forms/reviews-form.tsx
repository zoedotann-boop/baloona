"use client"

import { useTranslations } from "next-intl"
import { RefreshCw } from "lucide-react"
import { useState, useTransition } from "react"

import {
  AdminCard,
  AdminField,
  AdminInput,
  AdminToggle,
} from "@/components/admin/admin-ui"
import { LocalizedField } from "@/components/admin/localized-field"
import { RowList } from "@/components/admin/row-list"
import { SectionForm } from "@/components/admin/section-form"
import { saveReviews } from "@/lib/actions/admin/content"
import { syncGoogleReviews } from "@/lib/actions/admin/google-reviews"
import type { ReviewSource } from "@/lib/db/schema"
import { emptyLocalized, type Localized } from "@/lib/localized"

interface ReviewsDraft {
  reviews: {
    id?: string
    authorName: string
    rating: number
    text: Localized
    isPublished: boolean
    /** `YYYY-MM-DD`, what a date input round-trips. */
    publishedAt: string
    source: ReviewSource
  }[]
}

/** ניהול ביקורות — hand-written reviews plus a Google Places import. */
function ReviewsForm({
  slug,
  initial,
  hasPlaceId,
}: {
  slug: string
  initial: ReviewsDraft
  hasPlaceId: boolean
}) {
  const t = useTranslations("admin.reviews")
  const common = useTranslations("admin.common")
  const [draft, setDraft] = useState(initial)
  const [syncMessage, setSyncMessage] = useState<string | null>(null)
  const [syncing, startSync] = useTransition()

  function sync() {
    setSyncMessage(null)
    startSync(async () => {
      const result = await syncGoogleReviews({ slug })
      if (result.ok) {
        setSyncMessage(
          t("syncResult", {
            imported: result.imported,
            updated: result.updated,
          })
        )
        return
      }
      setSyncMessage(
        result.error === "missing-place-id"
          ? t("syncMissingPlaceId")
          : result.error === "missing-key"
            ? t("syncMissingKey")
            : t("syncError")
      )
    })
  }

  return (
    <SectionForm
      slug={slug}
      title={t("title")}
      description={t("description")}
      draft={draft}
      onDraftChange={setDraft}
      onSave={(value) =>
        saveReviews({
          slug,
          reviews: value.reviews.map(
            ({ source: _source, ...review }) => review
          ),
        })
      }
    >
      <AdminCard title={t("googleTitle")} description={t("googleDescription")}>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={sync}
            disabled={syncing || !hasPlaceId}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-[14px] font-bold text-brand-plum transition hover:bg-muted disabled:opacity-50"
          >
            <RefreshCw className="size-4" />
            {syncing ? t("syncing") : t("sync")}
          </button>
          {!hasPlaceId && (
            <span className="text-[14px] text-muted-foreground">
              {t("syncMissingPlaceId")}
            </span>
          )}
          {syncMessage && (
            <span
              role="status"
              className="text-[14px] font-bold text-brand-plum"
            >
              {syncMessage}
            </span>
          )}
        </div>
      </AdminCard>

      <AdminCard>
        <RowList
          items={draft.reviews}
          onChange={(reviews) => setDraft({ reviews })}
          createItem={() => ({
            authorName: "",
            rating: 5,
            text: emptyLocalized(),
            isPublished: true,
            publishedAt: new Date().toISOString().slice(0, 10),
            source: "manual" as ReviewSource,
          })}
          addLabel={t("addReview")}
          emptyLabel={common("empty")}
          renderRow={(review, _index, update) => (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-[12px] font-black text-muted-foreground">
                  {review.source === "google"
                    ? t("sourceGoogle")
                    : t("sourceManual")}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <AdminField label={t("author")} tooltip={t("authorTip")}>
                  <AdminInput
                    value={review.authorName}
                    onChange={(event) =>
                      update({ ...review, authorName: event.target.value })
                    }
                  />
                </AdminField>
                <AdminField label={t("rating")} tooltip={t("ratingTip")}>
                  <AdminInput
                    type="number"
                    min={1}
                    max={5}
                    value={review.rating}
                    onChange={(event) =>
                      update({
                        ...review,
                        rating: Number(event.target.value) || 5,
                      })
                    }
                  />
                </AdminField>
                <AdminField label={t("date")} tooltip={t("dateTip")}>
                  <AdminInput
                    type="date"
                    value={review.publishedAt}
                    onChange={(event) =>
                      update({ ...review, publishedAt: event.target.value })
                    }
                  />
                </AdminField>
              </div>
              <LocalizedField
                label={t("text")}
                tooltip={t("textTip")}
                multiline
                value={review.text}
                onChange={(text) => update({ ...review, text })}
              />
              <AdminToggle
                label={t("published")}
                checked={review.isPublished}
                onChange={(isPublished) => update({ ...review, isPublished })}
              />
            </div>
          )}
        />
      </AdminCard>
    </SectionForm>
  )
}

export { ReviewsForm }
