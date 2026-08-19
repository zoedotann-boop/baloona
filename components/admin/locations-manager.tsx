"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Pencil, Plus, Settings, Trash2 } from "lucide-react"
import { useState, useTransition } from "react"

import { AdminModal } from "@/components/admin/admin-modal"
import {
  adminCell,
  AdminTable,
  AdminTableEmpty,
  AdminTableRow,
} from "@/components/admin/admin-table"
import {
  AdminCard,
  AdminField,
  AdminFlag,
  AdminInput,
  AdminToggle,
} from "@/components/admin/admin-ui"
import { PillButton } from "@/components/brand/pill-button"
import { cn } from "@/lib/utils"
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
  const common = useTranslations("admin.common")
  const general = useTranslations("admin.general")
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

      <div className="mt-5">
        <AdminTable
          headers={[
            { label: t("nameLabel"), tooltip: t("nameLabelTip") },
            { label: t("slug"), className: "w-40", tooltip: t("slugTip") },
            {
              label: general("city"),
              className: "w-36",
              tooltip: general("cityTip"),
            },
            {
              label: t("published"),
              className: "w-32",
              tooltip: t("publishedTip"),
            },
            { label: common("actions"), className: "w-px sr-only" },
          ]}
        >
          {locations.length === 0 && (
            <AdminTableEmpty colSpan={5} label={t("empty")} />
          )}
          {locations.map((location) => (
            <LocationRow key={location.slug} location={location} />
          ))}
        </AdminTable>
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

function LocationRow({ location }: { location: ManagedLocation }) {
  const t = useTranslations("admin.locations")
  const common = useTranslations("admin.common")
  const [draft, setDraft] = useState(location)
  const [editing, setEditing] = useState(false)
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
    <AdminTableRow>
      <td className={adminCell}>
        <span className="font-bold text-brand-plum">{draft.name.he}</span>
      </td>
      <td className={cn(adminCell, "w-40")}>
        <span dir="ltr" className="block text-start text-muted-foreground">
          /{draft.slug}
        </span>
      </td>
      <td className={cn(adminCell, "w-36 text-muted-foreground")}>
        {draft.city}
      </td>
      <td className={cn(adminCell, "w-32")}>
        <AdminFlag
          on={draft.isPublished}
          label={draft.isPublished ? t("published") : t("unpublished")}
        />
      </td>
      <td className="px-2 py-1.5">
        <div className="flex items-center justify-end gap-0.5">
          <Link
            href={`/admin/${draft.slug}/general`}
            aria-label={t("settings")}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-white"
          >
            <Settings className="size-4" />
          </Link>
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label={common("edit")}
            className="flex size-8 items-center justify-center rounded-lg text-brand-plum transition hover:bg-white"
          >
            <Pencil className="size-4" />
          </button>
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
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
          >
            <Trash2 className="size-4" />
          </button>
        </div>

        <AdminModal
          open={editing}
          onClose={() => {
            save(draft)
            setEditing(false)
          }}
          title={draft.name.he || draft.slug}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <AdminField label={`${t("nameLabel")} (עב)`}>
              <AdminInput
                value={draft.name.he}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    name: { ...draft.name, he: event.target.value },
                  })
                }
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
                className="text-start"
              />
            </AdminField>
          </div>

          <AdminToggle
            label={draft.isPublished ? t("published") : t("unpublished")}
            checked={draft.isPublished}
            onChange={(isPublished) => save({ ...draft, isPublished })}
          />

          <p className="text-[13px] text-muted-foreground">{t("deleteHint")}</p>
          {pending && (
            <p className="text-[13px] text-muted-foreground">
              {common("saving")}
            </p>
          )}
        </AdminModal>
      </td>
    </AdminTableRow>
  )
}

export { LocationsManager }
