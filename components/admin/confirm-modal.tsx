"use client"

import { useTranslations } from "next-intl"
import { useEffect, useRef } from "react"

import { AdminDialog } from "./admin-dialog"

/**
 * "Are you sure?" for an action worth a second look — deleting a row, a branch,
 * a team member, an enquiry.
 *
 * The caller owns the wording, because the consequence genuinely differs: a row
 * removed from a draft list comes back if the editor never publishes, while a
 * branch delete is immediate and permanent. A shared component that claimed
 * "this cannot be undone" everywhere would be lying half the time.
 *
 * Cancel takes focus rather than confirm, so Enter on an accidental open backs
 * out instead of destroying something.
 */
function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  /** What is being acted on — usually the row's own name. */
  title: string
  /** What will actually happen, in the caller's words. */
  message: string
  confirmLabel?: string
}) {
  const t = useTranslations("admin.common")
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) cancelRef.current?.focus()
  }, [open])

  return (
    <AdminDialog
      open={open}
      onClose={onClose}
      className="w-[min(26rem,calc(100vw-2rem))]"
    >
      <div className="px-5 py-4">
        <h2 className="font-heading text-[17px] font-black text-brand-plum">
          {title}
        </h2>
        <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
          {message}
        </p>
      </div>

      <div className="flex justify-end gap-2 border-t border-border px-5 py-3">
        <button
          ref={cancelRef}
          type="button"
          onClick={onClose}
          className="inline-flex h-9 items-center rounded-full px-4 text-[14px] font-bold text-muted-foreground transition hover:bg-muted"
        >
          {t("cancel")}
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm()
            onClose()
          }}
          className="inline-flex h-9 items-center rounded-full bg-destructive px-4 text-[14px] font-extrabold text-white transition hover:brightness-110"
        >
          {confirmLabel ?? t("remove")}
        </button>
      </div>
    </AdminDialog>
  )
}

export { ConfirmModal }
