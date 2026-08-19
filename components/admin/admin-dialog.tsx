"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

/**
 * The bare dialog every admin overlay is built on.
 *
 * A native `<dialog>`, so focus trapping, Escape, the backdrop and top-layer
 * stacking come from the platform rather than from a dependency — including
 * when one dialog opens over another, which the admin does (a menu category and
 * then one of its items).
 *
 * Two behaviours the platform does not give us: closing on a backdrop click,
 * and swallowing Enter. The latter matters because these render inside a
 * section's `<form>`, where a stray keystroke would otherwise publish the page.
 */
function AdminDialog({
  open,
  onClose,
  className,
  children,
}: {
  open: boolean
  onClose: () => void
  className?: string
  children: React.ReactNode
}) {
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
      // The backdrop belongs to the dialog box, so a click that lands on the
      // element itself rather than its content came from outside.
      onClick={(event) => {
        if (event.target === ref.current) onClose()
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" && event.target instanceof HTMLInputElement) {
          event.preventDefault()
        }
      }}
      className={cn(
        "m-auto rounded-3xl border border-border bg-white p-0 text-foreground backdrop:bg-foreground/40 backdrop:backdrop-blur-[2px]",
        className
      )}
    >
      {children}
    </dialog>
  )
}

export { AdminDialog }
