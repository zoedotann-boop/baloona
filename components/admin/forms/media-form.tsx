"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"

import { AdminCard } from "@/components/admin/admin-ui"
import { ImageField } from "@/components/admin/image-field"
import { LocalizedField } from "@/components/admin/localized-field"
import { RowList } from "@/components/admin/row-list"
import { SectionForm } from "@/components/admin/section-form"
import { saveGallery } from "@/lib/actions/admin/content"
import { emptyLocalized, type Localized } from "@/lib/localized"

interface MediaDraft {
  images: { id?: string; url: string; alt: Localized }[]
}

/** מדיה — the home page gallery. The first image is the large cover tile. */
function MediaForm({ slug, initial }: { slug: string; initial: MediaDraft }) {
  const t = useTranslations("admin.media")
  const common = useTranslations("admin.common")
  const [draft, setDraft] = useState(initial)

  return (
    <SectionForm
      slug={slug}
      title={t("title")}
      description={t("description")}
      draft={draft}
      onDraftChange={setDraft}
      onSave={(value) =>
        saveGallery({
          slug,
          // Rows the editor added but never gave an image are dropped rather
          // than saved as broken tiles.
          images: value.images.filter((image) => image.url.trim()),
        })
      }
    >
      <AdminCard>
        <RowList
          items={draft.images}
          onChange={(images) => setDraft({ images })}
          createItem={() => ({ url: "", alt: emptyLocalized() })}
          addLabel={t("addImage")}
          emptyLabel={common("empty")}
          renderRow={(image, index, update) => (
            <div className="space-y-3">
              {index === 0 && (
                <span className="inline-flex rounded-full bg-brand-banana px-2.5 py-0.5 text-[12px] font-black text-brand-plum">
                  {t("cover")}
                </span>
              )}
              <ImageField
                label={t("dropzone")}
                hint={t("dropzoneHint")}
                folder="gallery"
                value={image.url}
                onChange={(url) => update({ ...image, url })}
              />
              <LocalizedField
                label={t("alt")}
                value={image.alt}
                onChange={(alt) => update({ ...image, alt })}
              />
            </div>
          )}
        />
      </AdminCard>
    </SectionForm>
  )
}

export { MediaForm }
