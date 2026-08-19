"use client"

import { Check, TriangleAlert } from "lucide-react"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"

import { cn } from "@/lib/utils"

/**
 * Transient confirmations for the admin — "published", "synced", "that failed".
 *
 * These used to sit inline beside the publish button, where a result on a long
 * page appeared wherever the editor was not looking. A toast is anchored to the
 * viewport instead, so the answer to "did that work?" lands in the same place
 * every time and then gets out of the way.
 *
 * Deliberately not a dependency: it is a list, a timer and an `aria-live`
 * region, and it wants the brand's own tokens.
 *
 * One rule for callers — do not toast from inside an `AdminDialog`. A native
 * `<dialog>` renders in the browser's top layer, above any z-index, so the
 * toast would be hidden behind it. Errors raised inside a dialog stay inline.
 */

type ToastTone = "success" | "error"

interface ToastItem {
  id: number
  message: string
  tone: ToastTone
}

/** How long a toast stays before dismissing itself. */
const DURATION_MS = 4000

const ToastContext = createContext<
  ((message: string, tone?: ToastTone) => void) | null
>(null)

/** Show a transient message. Defaults to the success tone. */
export function useToast() {
  const show = useContext(ToastContext)
  if (!show)
    throw new Error("useToast must be used inside the admin's <ToastProvider>")
  return show
}

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(0)

  const dismiss = useCallback(
    (id: number) => setToasts((current) => current.filter((t) => t.id !== id)),
    []
  )

  const show = useCallback((message: string, tone: ToastTone = "success") => {
    const id = nextId.current++
    setToasts((current) => [...current, { id, message, tone }])
  }, [])

  return (
    <ToastContext.Provider value={show}>
      {children}
      {/* Centred rather than corner-anchored: the admin's sidebar sits on the
          start edge in RTL, and centre reads the same in both directions. */}
      <div
        className="pointer-events-none fixed bottom-5 left-1/2 z-[100] flex w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-col items-center gap-2"
        aria-live="polite"
        aria-atomic={false}
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastItem
  onDismiss: (id: number) => void
}) {
  // Each toast owns its timer, so it cleans up with the element rather than
  // leaving the provider to track handles.
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), DURATION_MS)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  const isError = toast.tone === "error"
  const Icon = isError ? TriangleAlert : Check

  return (
    <div
      role={isError ? "alert" : "status"}
      onClick={() => onDismiss(toast.id)}
      className={cn(
        "toast-in pointer-events-auto flex cursor-default items-center gap-2.5 rounded-full px-4 py-2.5 text-[14px] font-bold shadow-lg",
        isError ? "bg-destructive text-white" : "bg-brand-plum text-white"
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden />
      {toast.message}
    </div>
  )
}

export { ToastProvider }
