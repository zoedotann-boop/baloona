"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Plus, Settings, Trash2 } from "lucide-react"
import { useState, useTransition } from "react"

import {
  AdminCard,
  AdminField,
  AdminInput,
  AdminToggle,
} from "@/components/admin/admin-ui"
import { PillButton } from "@/components/brand/pill-button"
import {
  createLocation,
  deleteLocation,
  updateLocation,
} from "@/lib/actions/admin/locations"
import type { Localized } from "@/lib/localized"

interface ManagedLocation {
  slug: string
  name: Localized
  isPublished: boolean
  sortOrder: number
  city: string
  address: string
}

/**
 * סניפים — the owner's list of branches, plus the form that opens a new one.
 *
 * Creating a branch provisions a full starter site, so the form only asks for
 * what is genuinely unique to the venue; everything else is edited afterwards
 * in the branch's own sections.
 */
function LocationsManager({ locations }: { locations: ManagedLocation[] }) {
  const t = useTranslations("admin.locations")
  const [adding, setAdding] = useState(locations.length === 0)

  return (
    <div className="pb-10">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-[28px] font-black text-brand-plum">
            {t("title")}
          </h1>
          <p className="mt-1 text-[15px] text-muted-foreground">
            {t("description")}
          </p>
        </div>
        {!adding && (
          <PillButton type="button" size="md" onClick={() => setAdding(true)}>
            <Plus className="size-4" />
            {t("add")}
          </PillButton>
        )}
      </header>

      {adding && <NewLocationForm onCancel={() => setAdding(false)} />}

      <div className="mt-5 space-y-4">
        {locations.length === 0 && !adding && (
          <p className="py-16 text-center text-[15px] text-muted-foreground">
            {t("empty")}
          </p>
        )}
        {locations.map((location) => (
          <LocationCard key={location.slug} location={location} />
        ))}
      </div>
    </div>
  )
}

function NewLocationForm({ onCancel }: { onCancel: () => void }) {
  const t = useTranslations("admin.locations")
  const common = useTranslations("admin.common")
  const general = useTranslations("admin.general")
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const text = (key: string) => String(form.get(key) ?? "")
    const localized = (key: string): Localized => ({
      he: text(`${key}He`),
      en: text(`${key}En`),
    })

    setError(null)
    start(async () => {
      const result = await createLocation({
        slug: text("slug"),
        name: localized("name"),
        city: localized("city"),
        address: localized("address"),
        phone: text("phone"),
        whatsapp: text("whatsapp"),
        email: text("email"),
      })
      // A successful create redirects, so anything returned here is an error.
      if (!result.ok)
        setError(result.error === "slug-taken" ? t("slugTaken") : result.error)
    })
  }

  const pair = (name: string, label: string, tooltip?: string) => (
    <div className="grid gap-3 sm:grid-cols-2">
      <AdminField label={`${label} (עב)`} tooltip={tooltip}>
        <AdminInput name={`${name}He`} required />
      </AdminField>
      <AdminField label={`${label} (EN)`}>
        <AdminInput name={`${name}En`} dir="ltr" />
      </AdminField>
    </div>
  )

  return (
    <AdminCard title={t("addTitle")} description={t("addDescription")}>
      <form onSubmit={submit} className="space-y-4">
        <AdminField label={t("slug")} tooltip={t("slugTip")}>
          <AdminInput
            name="slug"
            required
            dir="ltr"
            placeholder="kiryat-ono"
            className="text-start"
          />
        </AdminField>
        {pair("name", t("nameLabel"), t("nameLabelTip"))}
        {pair("city", general("city"), general("cityTip"))}
        {pair("address", general("address"), general("addressTip"))}
        <div className="grid gap-3 sm:grid-cols-3">
          <AdminField label={general("phone")} tooltip={general("phoneTip")}>
            <AdminInput name="phone" dir="ltr" />
          </AdminField>
          <AdminField
            label={general("whatsapp")}
            tooltip={general("whatsappTip")}
          >
            <AdminInput name="whatsapp" dir="ltr" />
          </AdminField>
          <AdminField label={general("email")} tooltip={general("emailTip")}>
            <AdminInput name="email" type="email" dir="ltr" />
          </AdminField>
        </div>

        {error && (
          <p role="alert" className="text-[14px] font-bold text-destructive">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <PillButton type="submit" size="md" disabled={pending}>
            {pending ? t("creating") : t("create")}
          </PillButton>
          <button
            type="button"
            onClick={onCancel}
            className="text-[14px] font-bold text-muted-foreground underline"
          >
            {common("cancel")}
          </button>
        </div>
      </form>
    </AdminCard>
  )
}

function LocationCard({ location }: { location: ManagedLocation }) {
  const t = useTranslations("admin.locations")
  const common = useTranslations("admin.common")
  const [draft, setDraft] = useState(location)
  const [pending, start] = useTransition()

  const save = (next: ManagedLocation) => {
    setDraft(next)
    start(async () => {
      await updateLocation({
        slug: next.slug,
        name: next.name,
        isPublished: next.isPublished,
        sortOrder: next.sortOrder,
      })
    })
  }

  return (
    <AdminCard>
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="font-heading text-[19px] font-black text-brand-plum">
            {draft.name.he}
          </div>
          <div className="text-[14px] text-muted-foreground">
            /{draft.slug} · {draft.city}
          </div>
        </div>

        <AdminToggle
          label={draft.isPublished ? t("published") : t("unpublished")}
          checked={draft.isPublished}
          onChange={(isPublished) => save({ ...draft, isPublished })}
        />

        <Link
          href={`/admin/${draft.slug}/general`}
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border px-4 text-[14px] font-bold text-brand-plum transition hover:bg-muted"
        >
          <Settings className="size-4" />
          {t("settings")}
        </Link>

        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (!confirm(t("deleteConfirm"))) return
            start(async () => {
              await deleteLocation(draft.slug)
            })
          }}
          aria-label={t("delete")}
          className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <AdminField label={`${t("nameLabel")} (עב)`}>
          <AdminInput
            value={draft.name.he}
            onChange={(event) =>
              setDraft({
                ...draft,
                name: { ...draft.name, he: event.target.value },
              })
            }
            onBlur={() => save(draft)}
          />
        </AdminField>
        <AdminField label={`${t("nameLabel")} (EN)`}>
          <AdminInput
            value={draft.name.en ?? ""}
            dir="ltr"
            onChange={(event) =>
              setDraft({
                ...draft,
                name: { ...draft.name, en: event.target.value },
              })
            }
            onBlur={() => save(draft)}
            className="text-start"
          />
        </AdminField>
      </div>

      <p className="mt-3 text-[13px] text-muted-foreground">
        {t("deleteHint")}
      </p>
      {pending && (
        <p className="mt-1 text-[13px] text-muted-foreground">
          {common("saving")}
        </p>
      )}
    </AdminCard>
  )
}

export { LocationsManager }
