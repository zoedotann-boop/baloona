"use client"

import { useTranslations } from "next-intl"
import { X } from "lucide-react"

import { PillButton } from "@/components/brand/pill-button"

import { AdminDialog } from "./admin-dialog"

/**
 * The admin's edit dialog — one row's full form, opened from its table row.
 *
 * There is no save button of its own: a dialog edits the section's draft in
 * place, and the draft is published from the page header like every other
 * change. Closing is therefore always safe, which is why the only footer
 * action is "done".
 */
function AdminModal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  const t = useTranslations("admin.common")

  return (
    <AdminDialog
      open={open}
      onClose={onClose}
      className="w-[min(44rem,calc(100vw-2rem))]"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
        <h2 className="truncate font-heading text-[18px] font-black text-brand-plum">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-4">
        {children}
      </div>

      <div className="flex justify-end border-t border-border px-5 py-3">
        <PillButton type="button" size="sm" onClick={onClose}>
          {t("done")}
        </PillButton>
      </div>
    </AdminDialog>
  )
}

export { AdminModal }
