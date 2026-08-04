"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"

import {
  AdminCard,
  AdminField,
  AdminInput,
  AdminToggle,
} from "@/components/admin/admin-ui"
import { ImageField } from "@/components/admin/image-field"
import {
  LocalizedField,
  LocalizedListField,
} from "@/components/admin/localized-field"
import { SectionForm } from "@/components/admin/section-form"
import {
  saveAnnouncement,
  saveContact,
  saveOpeningHours,
  saveSeo,
} from "@/lib/actions/admin/settings"
import type { SeoPage } from "@/lib/db/schema"
import type { Localized, LocalizedList } from "@/lib/localized"

interface GeneralSettingsDraft {
  contact: {
    city: Localized
    address: Localized
    phone: string
    whatsapp: string
    email: string
    leadRecipientEmail: string
    instagramUrl: string
    facebookUrl: string
    tiktokUrl: string
  }
  hours: {
    weekday: number
    opensAt: string
    closesAt: string
    isClosed: boolean
  }[]
  announcement: {
    isActive: boolean
    title: Localized
    body: Localized
    lines: LocalizedList
    ctaLabel: Localized
    ctaHref: string
    bumpVersion: boolean
  }
  seo: {
    pages: {
      page: SeoPage
      title: Localized
      description: Localized
      keywords: Localized
    }[]
    googlePlaceId: string
    gaMeasurementId: string
    metaPixelId: string
    gtmContainerId: string
    faviconUrl: string
    ogImageUrl: string
  }
}

/**
 * הגדרות כלליות — contact details, hours, the pop-up and SEO in one publish.
 *
 * The page maps to four save actions but a single button: an editor changing a
 * phone number and a meta description thinks of it as one edit.
 */
function GeneralSettingsForm({
  slug,
  initial,
}: {
  slug: string
  initial: GeneralSettingsDraft
}) {
  const t = useTranslations("admin.general")
  const common = useTranslations("admin.common")
  const weekdays = useTranslations("weekdays")
  const [draft, setDraft] = useState(initial)

  const dayNames = weekdays.raw("long") as string[]
  const pageLabels: Record<SeoPage, string> = {
    home: t("pageHome"),
    menu: t("pageMenu"),
    birthdays: t("pageBirthdays"),
  }

  const update = <K extends keyof GeneralSettingsDraft>(
    key: K,
    value: GeneralSettingsDraft[K]
  ) => setDraft((current) => ({ ...current, [key]: value }))

  async function save(value: GeneralSettingsDraft) {
    const results = await Promise.all([
      saveContact({ slug, ...value.contact }),
      saveOpeningHours({ slug, days: value.hours }),
      saveAnnouncement({ slug, ...value.announcement }),
      saveSeo({ slug, ...value.seo }),
    ])
    const failure = results.find((result) => !result.ok)
    if (failure && !failure.ok) return { ok: false, error: failure.error }
    // The bump is a one-shot: keep it from re-firing on the next publish.
    setDraft((current) => ({
      ...current,
      announcement: { ...current.announcement, bumpVersion: false },
    }))
    return { ok: true }
  }

  return (
    <SectionForm
      slug={slug}
      title={t("title")}
      description={t("description")}
      draft={draft}
      onDraftChange={setDraft}
      onSave={save}
    >
      <AdminCard
        title={t("contactTitle")}
        description={t("contactDescription")}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <LocalizedField
            label={t("city")}
            value={draft.contact.city}
            onChange={(city) => update("contact", { ...draft.contact, city })}
          />
          <LocalizedField
            label={t("address")}
            value={draft.contact.address}
            onChange={(address) =>
              update("contact", { ...draft.contact, address })
            }
          />
          <AdminField label={t("phone")}>
            <AdminInput
              value={draft.contact.phone}
              dir="ltr"
              onChange={(event) =>
                update("contact", {
                  ...draft.contact,
                  phone: event.target.value,
                })
              }
              className="text-start"
            />
          </AdminField>
          <AdminField label={t("whatsapp")} hint={t("whatsappHint")}>
            <AdminInput
              value={draft.contact.whatsapp}
              dir="ltr"
              inputMode="numeric"
              onChange={(event) =>
                update("contact", {
                  ...draft.contact,
                  whatsapp: event.target.value,
                })
              }
              className="text-start"
            />
          </AdminField>
          <AdminField label={t("email")}>
            <AdminInput
              type="email"
              value={draft.contact.email}
              dir="ltr"
              onChange={(event) =>
                update("contact", {
                  ...draft.contact,
                  email: event.target.value,
                })
              }
              className="text-start"
            />
          </AdminField>
          <AdminField label={t("leadEmail")} hint={t("leadEmailHint")}>
            <AdminInput
              type="email"
              value={draft.contact.leadRecipientEmail}
              dir="ltr"
              onChange={(event) =>
                update("contact", {
                  ...draft.contact,
                  leadRecipientEmail: event.target.value,
                })
              }
              className="text-start"
            />
          </AdminField>
          {(
            [
              ["instagramUrl", t("instagram")],
              ["facebookUrl", t("facebook")],
              ["tiktokUrl", t("tiktok")],
            ] as const
          ).map(([key, label]) => (
            <AdminField key={key} label={label}>
              <AdminInput
                value={draft.contact[key]}
                dir="ltr"
                placeholder="https://"
                onChange={(event) =>
                  update("contact", {
                    ...draft.contact,
                    [key]: event.target.value,
                  })
                }
                className="text-start"
              />
            </AdminField>
          ))}
        </div>
      </AdminCard>

      <AdminCard title={t("hoursTitle")} description={t("hoursDescription")}>
        <div className="space-y-2">
          {draft.hours.map((day, index) => (
            <div
              key={day.weekday}
              className="flex flex-wrap items-center gap-3"
            >
              <span className="w-20 shrink-0 text-[14px] font-bold text-brand-plum">
                {dayNames[day.weekday]}
              </span>
              <AdminInput
                type="time"
                aria-label={`${dayNames[day.weekday]} · ${t("opensAt")}`}
                value={day.opensAt}
                disabled={day.isClosed}
                onChange={(event) =>
                  update(
                    "hours",
                    draft.hours.map((row, i) =>
                      i === index
                        ? { ...row, opensAt: event.target.value }
                        : row
                    )
                  )
                }
                className="w-32 disabled:opacity-40"
              />
              <span className="text-muted-foreground">—</span>
              <AdminInput
                type="time"
                aria-label={`${dayNames[day.weekday]} · ${t("closesAt")}`}
                value={day.closesAt}
                disabled={day.isClosed}
                onChange={(event) =>
                  update(
                    "hours",
                    draft.hours.map((row, i) =>
                      i === index
                        ? { ...row, closesAt: event.target.value }
                        : row
                    )
                  )
                }
                className="w-32 disabled:opacity-40"
              />
              <AdminToggle
                label={t("closed")}
                checked={day.isClosed}
                onChange={(isClosed) =>
                  update(
                    "hours",
                    draft.hours.map((row, i) =>
                      i === index ? { ...row, isClosed } : row
                    )
                  )
                }
              />
            </div>
          ))}
        </div>
      </AdminCard>

      <AdminCard title={t("popupTitle")} description={t("popupDescription")}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-[14px] font-bold text-brand-plum">
              {t("popupStatus")}
            </div>
            <div className="text-[13px] text-muted-foreground">
              {draft.announcement.isActive
                ? t("popupActive")
                : t("popupInactive")}
            </div>
          </div>
          <AdminToggle
            label=""
            checked={draft.announcement.isActive}
            onChange={(isActive) =>
              update("announcement", { ...draft.announcement, isActive })
            }
          />
        </div>

        <div className="space-y-4">
          <LocalizedField
            label={t("popupHeading")}
            value={draft.announcement.title}
            onChange={(title) =>
              update("announcement", { ...draft.announcement, title })
            }
          />
          <LocalizedField
            label={t("popupBody")}
            multiline
            rows={2}
            value={draft.announcement.body}
            onChange={(body) =>
              update("announcement", { ...draft.announcement, body })
            }
          />
          <LocalizedListField
            label={t("popupLines")}
            value={draft.announcement.lines}
            onChange={(lines) =>
              update("announcement", { ...draft.announcement, lines })
            }
            addLabel={common("add")}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <LocalizedField
              label={t("popupCta")}
              value={draft.announcement.ctaLabel}
              onChange={(ctaLabel) =>
                update("announcement", { ...draft.announcement, ctaLabel })
              }
            />
            <AdminField label={t("popupCtaHref")}>
              <AdminInput
                value={draft.announcement.ctaHref}
                dir="ltr"
                onChange={(event) =>
                  update("announcement", {
                    ...draft.announcement,
                    ctaHref: event.target.value,
                  })
                }
                className="text-start"
              />
            </AdminField>
          </div>
          <AdminToggle
            label={t("popupBump")}
            checked={draft.announcement.bumpVersion}
            onChange={(bumpVersion) =>
              update("announcement", { ...draft.announcement, bumpVersion })
            }
          />
        </div>
      </AdminCard>

      <AdminCard title={t("seoTitle")} description={t("seoDescription")}>
        <div className="space-y-6">
          {draft.seo.pages.map((page, index) => (
            <div key={page.page} className="space-y-4">
              <div className="text-[13px] font-black tracking-[0.08em] text-muted-foreground uppercase">
                {pageLabels[page.page]}
              </div>
              <LocalizedField
                label={t("metaTitle")}
                value={page.title}
                onChange={(title) =>
                  update("seo", {
                    ...draft.seo,
                    pages: draft.seo.pages.map((row, i) =>
                      i === index ? { ...row, title } : row
                    ),
                  })
                }
              />
              <LocalizedField
                label={t("metaDescription")}
                multiline
                rows={2}
                value={page.description}
                onChange={(description) =>
                  update("seo", {
                    ...draft.seo,
                    pages: draft.seo.pages.map((row, i) =>
                      i === index ? { ...row, description } : row
                    ),
                  })
                }
              />
              <LocalizedField
                label={t("keywords")}
                value={page.keywords}
                onChange={(keywords) =>
                  update("seo", {
                    ...draft.seo,
                    pages: draft.seo.pages.map((row, i) =>
                      i === index ? { ...row, keywords } : row
                    ),
                  })
                }
              />
            </div>
          ))}
        </div>
      </AdminCard>

      <AdminCard
        title={t("trackingTitle")}
        description={t("trackingDescription")}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["gaMeasurementId", t("ga"), "G-XXXXXXXXXX"],
              ["metaPixelId", t("pixel"), "123456789012345"],
              ["gtmContainerId", t("gtm"), "GTM-XXXXXXX"],
            ] as const
          ).map(([key, label, placeholder]) => (
            <AdminField key={key} label={label}>
              <AdminInput
                value={draft.seo[key]}
                dir="ltr"
                placeholder={placeholder}
                onChange={(event) =>
                  update("seo", { ...draft.seo, [key]: event.target.value })
                }
                className="text-start"
              />
            </AdminField>
          ))}
          <AdminField label={t("placeId")} hint={t("placeIdHint")}>
            <AdminInput
              value={draft.seo.googlePlaceId}
              dir="ltr"
              placeholder="ChIJ…"
              onChange={(event) =>
                update("seo", {
                  ...draft.seo,
                  googlePlaceId: event.target.value,
                })
              }
              className="text-start"
            />
          </AdminField>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <ImageField
            label={t("ogImage")}
            folder="branding"
            value={draft.seo.ogImageUrl}
            onChange={(ogImageUrl) =>
              update("seo", { ...draft.seo, ogImageUrl })
            }
          />
          <ImageField
            label={t("favicon")}
            folder="branding"
            value={draft.seo.faviconUrl}
            onChange={(faviconUrl) =>
              update("seo", { ...draft.seo, faviconUrl })
            }
          />
        </div>
      </AdminCard>
    </SectionForm>
  )
}

export { GeneralSettingsForm }
