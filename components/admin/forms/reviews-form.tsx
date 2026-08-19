"use client"

import { useTranslations } from "next-intl"
import { RefreshCw } from "lucide-react"
import { useState, useTransition } from "react"

import {
  AdminCard,
  AdminField,
  AdminFlag,
  AdminInput,
  AdminToggle,
} from "@/components/admin/admin-ui"
import { LocalizedField } from "@/components/admin/localized-field"
import { RowTable } from "@/components/admin/row-table"
import { SectionForm } from "@/components/admin/section-form"
import type { ReviewDraft } from "@/lib/admin/drafts"
import { saveReviews } from "@/lib/actions/admin/content"
import { syncGoogleReviews } from "@/lib/actions/admin/google-reviews"
import { emptyLocalized } from "@/lib/localized"

interface ReviewsDraft {
  autoSync: boolean
  reviews: ReviewDraft[]
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
        // The sync already wrote to the database, so adopt what it returned
        // rather than leaving the table showing the pre-sync list.
        setDraft((current) => ({ ...current, reviews: result.reviews }))
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
          autoSync: value.autoSync,
          reviews: value.reviews.map(
            ({ source: _source, ...review }) => review
          ),
        })
      }
    >
      <AdminCard title={t("googleTitle")} description={t("googleDescription")}>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <button
            type="button"
            onClick={sync}
            disabled={syncing || !hasPlaceId}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-border px-3.5 text-[13px] font-bold text-brand-plum transition hover:bg-muted disabled:opacity-50"
          >
            <RefreshCw className="size-4" />
            {syncing ? t("syncing") : t("sync")}
          </button>

          <AdminToggle
            label={t("autoSync")}
            tooltip={t("autoSyncTip")}
            checked={draft.autoSync}
            onChange={(autoSync) => setDraft({ ...draft, autoSync })}
          />

          {!hasPlaceId && (
            <span className="text-[13px] text-muted-foreground">
              {t("syncMissingPlaceId")}
            </span>
          )}
          {syncMessage && (
            <span
              role="status"
              className="text-[13px] font-bold text-brand-plum"
            >
              {syncMessage}
            </span>
          )}
        </div>
      </AdminCard>

      <AdminCard>
        <RowTable
          items={draft.reviews}
          onChange={(reviews) => setDraft({ ...draft, reviews })}
          createItem={() => ({
            authorName: "",
            rating: 5,
            text: emptyLocalized(),
            isPublished: true,
            publishedAt: new Date().toISOString().slice(0, 10),
            source: "manual" as const,
          })}
          addLabel={t("addReview")}
          emptyLabel={common("empty")}
          columns={[
            {
              header: t("author"),
              tooltip: t("authorTip"),
              cell: (review) => review.authorName,
              className: "w-40",
            },
            {
              header: t("rating"),
              tooltip: t("ratingTip"),
              cell: (review) => "★".repeat(review.rating),
              className: "w-24 text-brand-plum",
            },
            {
              header: t("text"),
              tooltip: t("textTip"),
              cell: (review) => (
                <span className="line-clamp-1 text-muted-foreground">
                  {review.text.he}
                </span>
              ),
            },
            {
              header: t("date"),
              tooltip: t("dateTip"),
              cell: (review) => review.publishedAt,
              className: "w-28 whitespace-nowrap",
            },
            {
              header: t("source"),
              tooltip: t("sourceTip"),
              cell: (review) =>
                review.source === "google"
                  ? t("sourceGoogle")
                  : t("sourceManual"),
              className: "w-24",
            },
            {
              header: t("published"),
              tooltip: t("publishedTip"),
              cell: (review) => (
                <AdminFlag on={review.isPublished} label={t("published")} />
              ),
              className: "w-32",
            },
          ]}
          editTitle={(review) => review.authorName || t("addReview")}
          renderRow={(review, _index, update) => (
            <div className="space-y-3">
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
