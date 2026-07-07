"use client"

import { useTranslations } from "next-intl"
import { X } from "lucide-react"
import { useEffect, useId, useRef, useSyncExternalStore } from "react"

import { PillButton } from "@/components/brand/pill-button"

// Bump when the announcement copy changes so returning visitors see it again.
const ANNOUNCEMENT_VERSION = "2026-independence-day"
const STORAGE_KEY = `baloona:announcement:${ANNOUNCEMENT_VERSION}`

// localStorage is an external system, so we read it through
// useSyncExternalStore rather than mirroring it into React state in an effect.
const listeners = new Set<() => void>()

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  window.addEventListener("storage", onChange)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener("storage", onChange)
  }
}

function hasBeenSeen() {
  return localStorage.getItem(STORAGE_KEY) === "seen"
}

function markSeen() {
  localStorage.setItem(STORAGE_KEY, "seen")
  listeners.forEach((notify) => notify())
}

/**
 * Site-wide announcement pop-up (e.g. holiday opening hours). Opens once per
 * browser until dismissed, then stays closed for this announcement version.
 */
function AnnouncementModal() {
  const t = useTranslations("announcement")
  const closeRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const bodyId = useId()

  // Treat as seen during SSR and first paint so the server markup is stable;
  // the real localStorage value takes over after hydration.
  const seen = useSyncExternalStore(subscribe, hasBeenSeen, () => true)
  const open = !seen

  // While open: lock scroll, focus the dialog and close on Escape.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") markSeen()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  if (!open) return null

  const lines = t.raw("lines") as string[]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
      <button
        type="button"
        aria-label={t("close")}
        tabIndex={-1}
        className="absolute inset-0 cursor-default bg-brand-brown/40 backdrop-blur-[2px]"
        onClick={markSeen}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        className="relative w-full max-w-md rounded-4xl border border-[#f4dbdf] bg-brand-cream p-7 text-center shadow-[0_30px_60px_-24px_rgba(90,52,43,0.5)]"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={markSeen}
          aria-label={t("close")}
          className="absolute end-4 top-4 flex size-9 items-center justify-center rounded-full text-brand-muted transition-colors hover:bg-brand-pink/50 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <X className="size-5" />
        </button>

        <h2
          id={titleId}
          className="font-heading text-2xl font-black tracking-[-0.5px] text-brand-brown"
        >
          {t("title")}
        </h2>

        <ul id={bodyId} className="mt-5 flex flex-col gap-3 text-right">
          {lines.map((line) => (
            <li
              key={line}
              className="rounded-2xl bg-white/70 px-4 py-3 text-[15px] leading-relaxed font-semibold text-[#6b5f60]"
            >
              {line}
            </li>
          ))}
        </ul>

        <PillButton
          type="button"
          onClick={markSeen}
          size="md"
          className="mt-6 w-full"
        >
          {t("cta")}
        </PillButton>
      </div>
    </div>
  )
}

export { AnnouncementModal }
