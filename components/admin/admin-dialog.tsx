"use client"

import { createContext, useContext, useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

/**
 * The bare dialog every admin overlay is built on.
 *
 * A native `<dialog>`, so focus trapping, Escape, the backdrop and top-layer
 * stacking come from the platform rather than from a dependency.
 *
 * Two behaviours the platform does not give us: closing on a backdrop click,
 * and swallowing Enter. The latter matters because these render inside a
 * section's `<form>`, where a stray keystroke would otherwise publish the page.
 *
 * It also marks its subtree as "already in a dialog". A dialog on top of a
 * dialog is disorienting — two backdrops, two Escape targets, and no way to see
 * what the first one said — so components that would open one check
 * {@link useInDialog} and fall back to editing in place instead. The rule is
 * structural rather than a convention every call site has to remember.
 */

const InDialogContext = createContext(false)

/** True when this subtree is already rendered inside an {@link AdminDialog}. */
export function useInDialog(): boolean {
  return useContext(InDialogContext)
}

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
      <InDialogContext.Provider value>{children}</InDialogContext.Provider>
    </dialog>
  )
}

export { AdminDialog }
