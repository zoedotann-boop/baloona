"use client"

import { useTranslations } from "next-intl"
import { X } from "lucide-react"
import { useEffect, useId, useRef, useSyncExternalStore } from "react"

import { PillButton } from "@/components/brand/pill-button"

interface AnnouncementModalProps {
  /** Scopes the "seen" flag; bump it in the admin to re-show the pop-up. */
  storageKey: string
  title: string
  body?: string
  lines?: string[]
  ctaLabel?: string
  ctaHref?: string
}

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

function markSeen(storageKey: string) {
  localStorage.setItem(storageKey, "seen")
  listeners.forEach((notify) => notify())
}

/**
 * Site-wide announcement pop-up (e.g. holiday opening hours). Opens once per
 * browser until dismissed, then stays closed for this announcement version.
 */
function AnnouncementModal({
  storageKey,
  title,
  body,
  lines = [],
  ctaLabel,
  ctaHref,
}: AnnouncementModalProps) {
  const t = useTranslations("announcement")
  const closeRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const bodyId = useId()

  // Treat as seen during SSR and first paint so the server markup is stable;
  // the real localStorage value takes over after hydration.
  const seen = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(storageKey) === "seen",
    () => true
  )
  const open = !seen

  // While open: lock scroll, focus the dialog and close on Escape.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") markSeen(storageKey)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open, storageKey])

  if (!open) return null

  const label = ctaLabel || t("cta")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
      <button
        type="button"
        aria-label={t("close")}
        tabIndex={-1}
        className="absolute inset-0 cursor-default bg-foreground/40 backdrop-blur-[2px]"
        onClick={() => markSeen(storageKey)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        className="relative w-full max-w-md rounded-4xl border border-border bg-brand-cloud p-7 text-center"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={() => markSeen(storageKey)}
          aria-label={t("close")}
          className="absolute end-4 top-4 flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-brand-pink/50 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <X className="size-5" />
        </button>

        <h2
          id={titleId}
          className="font-heading text-2xl font-black tracking-[-0.5px] text-brand-plum"
        >
          {title}
        </h2>

        <div id={bodyId}>
          {body && (
            <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
              {body}
            </p>
          )}
          {lines.length > 0 && (
            <ul className="mt-5 flex flex-col gap-3 text-right">
              {lines.map((line) => (
                <li
                  key={line}
                  className="rounded-2xl bg-white/70 px-4 py-3 text-[17px] leading-relaxed font-semibold text-muted-foreground"
                >
                  {line}
                </li>
              ))}
            </ul>
          )}
        </div>

        {ctaHref ? (
          <PillButton
            href={ctaHref}
            size="md"
            className="mt-6 w-full"
            onClick={() => markSeen(storageKey)}
          >
            {label}
          </PillButton>
        ) : (
          <PillButton
            type="button"
            onClick={() => markSeen(storageKey)}
            size="md"
            className="mt-6 w-full"
          >
            {label}
          </PillButton>
        )}
      </div>
    </div>
  )
}

export { AnnouncementModal }
