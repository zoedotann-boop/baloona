"use client"

import { useTranslations } from "next-intl"
import { X } from "lucide-react"
import { useEffect, useRef } from "react"

import { PillButton } from "@/components/brand/pill-button"

/**
 * The admin's edit dialog — one row's full form, opened from its table row.
 *
 * Built on the native `<dialog>` element so focus trapping, Escape, the
 * backdrop and top-layer stacking come from the platform rather than from a
 * dependency. The admin only ever needs "open a form over the table".
 *
 * There is no save button of its own: a dialog edits the section's draft in
 * place, and the draft is published from the page header like every other
 * change. Closing is therefore always safe.
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
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    else if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      // The backdrop is part of the dialog box, so a click that lands on the
      // element itself (rather than on its content) came from outside.
      onClick={(event) => {
        if (event.target === ref.current) onClose()
      }}
      // The dialog sits inside the section's <form>, so a stray Enter would
      // publish the whole page. Rows are saved from the header instead.
      onKeyDown={(event) => {
        if (event.key === "Enter" && event.target instanceof HTMLInputElement) {
          event.preventDefault()
        }
      }}
      className="m-auto w-[min(44rem,calc(100vw-2rem))] rounded-3xl border border-border bg-white p-0 text-foreground backdrop:bg-foreground/40 backdrop:backdrop-blur-[2px]"
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
        <PillButton type="button" size="md" onClick={onClose}>
          {t("done")}
        </PillButton>
      </div>
    </dialog>
  )
}

export { AdminModal }
