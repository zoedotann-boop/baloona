"use client"

import { createContext, useContext, useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

const InDialogContext = createContext(false)

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
