"use client"

import { useTranslations } from "next-intl"
import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

import { AdminDialog } from "./admin-dialog"

function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  tone = "danger",
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  tone?: "danger" | "primary"
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
          className={cn(
            "inline-flex h-9 items-center rounded-full px-4 text-[14px] font-extrabold transition hover:brightness-110",
            tone === "primary"
              ? "bg-brand-pink text-brand-plum"
              : "bg-destructive text-white"
          )}
        >
          {confirmLabel ?? t("remove")}
        </button>
      </div>
    </AdminDialog>
  )
}

export { ConfirmModal }
