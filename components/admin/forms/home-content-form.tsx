"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"

import { AdminCard } from "@/components/admin/admin-ui"
import { ImageField } from "@/components/admin/image-field"
import { LocalizedField } from "@/components/admin/localized-field"
import { RowList } from "@/components/admin/row-list"
import { SectionForm } from "@/components/admin/section-form"
import { saveHomeContent } from "@/lib/actions/admin/content"
import { emptyLocalized, type Localized } from "@/lib/localized"

interface LabelledRow {
  id?: string
  label: Localized
}

interface HomeContentDraft {
  home: {
    heroBadge: Localized
    heroTitle: Localized
    heroDescription: Localized
    heroImages: string[]
    aboutTitle: Localized
    aboutBody: Localized
    aboutImageUrl: string
    featuresCta: Localized
    reassuranceTitle: Localized
    reassuranceBody: Localized
    reassuranceCta: Localized
    menuTeaserTitle: Localized
    menuTeaserBody: Localized
    menuTeaserCta: Localized
    birthdayTeaserTitle: Localized
    birthdayTeaserBody: Localized
    birthdayTeaserCta: Localized
    birthdayTeaserImageUrl: string
    galleryTitle: Localized
    reviewsTitle: Localized
  }
  site: {
    footerTagline: Localized
    contactTitle: Localized
    contactEyebrow: Localized
  }
  features: { id?: string; title: Localized; description: Localized }[]
  teaserTiles: LabelledRow[]
  contactSubjects: LabelledRow[]
}

/** עמוד הבית — every string and image the home page and footer render. */
function HomeContentForm({
  slug,
  initial,
}: {
  slug: string
  initial: HomeContentDraft
}) {
  const t = useTranslations("admin.home")
  const common = useTranslations("admin.common")
  const [draft, setDraft] = useState(initial)

  const home = <K extends keyof HomeContentDraft["home"]>(
    key: K,
    value: HomeContentDraft["home"][K]
  ) =>
    setDraft((current) => ({
      ...current,
      home: { ...current.home, [key]: value },
    }))

  const site = <K extends keyof HomeContentDraft["site"]>(
    key: K,
    value: HomeContentDraft["site"][K]
  ) =>
    setDraft((current) => ({
      ...current,
      site: { ...current.site, [key]: value },
    }))

  // The hero mosaic always renders three slots; empty ones fall back to the
  // placeholder frame rather than collapsing the layout.
  const heroImages = [0, 1, 2].map(
    (index) => draft.home.heroImages[index] ?? ""
  )

  return (
    <SectionForm
      slug={slug}
      title={t("title")}
      description={t("description")}
      draft={draft}
      onDraftChange={setDraft}
      onSave={(value) => saveHomeContent({ slug, ...value })}
    >
      <AdminCard title={t("heroTitle")}>
        <div className="space-y-4">
          <LocalizedField
            label={t("heroBadge")}
            value={draft.home.heroBadge}
            onChange={(value) => home("heroBadge", value)}
          />
          <LocalizedField
            label={t("heroHeading")}
            value={draft.home.heroTitle}
            onChange={(value) => home("heroTitle", value)}
          />
          <LocalizedField
            label={t("heroDescription")}
            multiline
            value={draft.home.heroDescription}
            onChange={(value) => home("heroDescription", value)}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {heroImages.map((url, index) => (
              <ImageField
                key={index}
                label={`${t("heroImages")} ${index + 1}`}
                folder="hero"
                value={url}
                onChange={(next) =>
                  home(
                    "heroImages",
                    heroImages
                      .map((current, i) => (i === index ? next : current))
                      .filter(Boolean)
                  )
                }
              />
            ))}
          </div>
        </div>
      </AdminCard>

      <AdminCard title={t("aboutTitle")}>
        <div className="space-y-4">
          <LocalizedField
            label={t("aboutHeading")}
            value={draft.home.aboutTitle}
            onChange={(value) => home("aboutTitle", value)}
          />
          <LocalizedField
            label={t("aboutBody")}
            multiline
            rows={4}
            value={draft.home.aboutBody}
            onChange={(value) => home("aboutBody", value)}
          />
          <ImageField
            label={t("aboutImage")}
            folder="hero"
            value={draft.home.aboutImageUrl}
            onChange={(value) => home("aboutImageUrl", value)}
          />
        </div>
      </AdminCard>

      <AdminCard title={t("featuresTitle")}>
        <RowList
          items={draft.features}
          onChange={(features) =>
            setDraft((current) => ({ ...current, features }))
          }
          createItem={() => ({
            title: emptyLocalized(),
            description: emptyLocalized(),
          })}
          addLabel={common("add")}
          emptyLabel={common("empty")}
          renderRow={(item, _index, update) => (
            <div className="space-y-3">
              <LocalizedField
                label={t("featureHeading")}
                value={item.title}
                onChange={(title) => update({ ...item, title })}
              />
              <LocalizedField
                label={t("featureDescription")}
                value={item.description}
                onChange={(description) => update({ ...item, description })}
              />
            </div>
          )}
        />
        <div className="mt-4">
          <LocalizedField
            label={t("featuresCta")}
            value={draft.home.featuresCta}
            onChange={(value) => home("featuresCta", value)}
          />
        </div>
      </AdminCard>

      <AdminCard title={t("reassuranceTitle")}>
        <div className="space-y-4">
          <LocalizedField
            label={t("reassuranceHeading")}
            value={draft.home.reassuranceTitle}
            onChange={(value) => home("reassuranceTitle", value)}
          />
          <LocalizedField
            label={t("reassuranceBody")}
            multiline
            value={draft.home.reassuranceBody}
            onChange={(value) => home("reassuranceBody", value)}
          />
          <LocalizedField
            label={t("reassuranceCta")}
            value={draft.home.reassuranceCta}
            onChange={(value) => home("reassuranceCta", value)}
          />
        </div>
      </AdminCard>

      <AdminCard title={t("teaserTitle")}>
        <div className="space-y-4">
          <LocalizedField
            label={t("teaserHeading")}
            value={draft.home.menuTeaserTitle}
            onChange={(value) => home("menuTeaserTitle", value)}
          />
          <LocalizedField
            label={t("teaserBody")}
            multiline
            value={draft.home.menuTeaserBody}
            onChange={(value) => home("menuTeaserBody", value)}
          />
          <LocalizedField
            label={t("teaserCta")}
            value={draft.home.menuTeaserCta}
            onChange={(value) => home("menuTeaserCta", value)}
          />
          <div>
            <div className="mb-2 text-[13px] font-bold text-brand-plum">
              {t("teaserTiles")}
            </div>
            <RowList
              items={draft.teaserTiles}
              onChange={(teaserTiles) =>
                setDraft((current) => ({ ...current, teaserTiles }))
              }
              createItem={() => ({ label: emptyLocalized() })}
              addLabel={common("add")}
              emptyLabel={common("empty")}
              renderRow={(item, _index, update) => (
                <LocalizedField
                  label={t("subjectLabel")}
                  value={item.label}
                  onChange={(label) => update({ ...item, label })}
                />
              )}
            />
          </div>
        </div>
      </AdminCard>

      <AdminCard title={t("birthdayTeaserTitle")}>
        <div className="space-y-4">
          <LocalizedField
            label={t("birthdayTeaserHeading")}
            value={draft.home.birthdayTeaserTitle}
            onChange={(value) => home("birthdayTeaserTitle", value)}
          />
          <LocalizedField
            label={t("birthdayTeaserBody")}
            multiline
            value={draft.home.birthdayTeaserBody}
            onChange={(value) => home("birthdayTeaserBody", value)}
          />
          <LocalizedField
            label={t("birthdayTeaserCta")}
            value={draft.home.birthdayTeaserCta}
            onChange={(value) => home("birthdayTeaserCta", value)}
          />
          <ImageField
            label={t("birthdayTeaserImage")}
            folder="hero"
            value={draft.home.birthdayTeaserImageUrl}
            onChange={(value) => home("birthdayTeaserImageUrl", value)}
          />
        </div>
      </AdminCard>

      <AdminCard title={t("sectionsTitle")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <LocalizedField
            label={t("galleryTitle")}
            value={draft.home.galleryTitle}
            onChange={(value) => home("galleryTitle", value)}
          />
          <LocalizedField
            label={t("reviewsTitle")}
            value={draft.home.reviewsTitle}
            onChange={(value) => home("reviewsTitle", value)}
          />
        </div>
      </AdminCard>

      <AdminCard title={t("footerTitle")}>
        <div className="space-y-4">
          <LocalizedField
            label={t("footerTagline")}
            multiline
            rows={2}
            value={draft.site.footerTagline}
            onChange={(value) => site("footerTagline", value)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <LocalizedField
              label={t("contactTitle")}
              value={draft.site.contactTitle}
              onChange={(value) => site("contactTitle", value)}
            />
            <LocalizedField
              label={t("contactEyebrow")}
              value={draft.site.contactEyebrow}
              onChange={(value) => site("contactEyebrow", value)}
            />
          </div>
          <div>
            <div className="mb-2 text-[13px] font-bold text-brand-plum">
              {t("subjectsTitle")}
            </div>
            <RowList
              items={draft.contactSubjects}
              onChange={(contactSubjects) =>
                setDraft((current) => ({ ...current, contactSubjects }))
              }
              createItem={() => ({ label: emptyLocalized() })}
              addLabel={common("add")}
              emptyLabel={common("empty")}
              renderRow={(item, _index, update) => (
                <LocalizedField
                  label={t("subjectLabel")}
                  value={item.label}
                  onChange={(label) => update({ ...item, label })}
                />
              )}
            />
          </div>
        </div>
      </AdminCard>
    </SectionForm>
  )
}

export { HomeContentForm }
