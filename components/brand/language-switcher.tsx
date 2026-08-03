"use client"

import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { cn } from "@/lib/utils"

const LANGUAGES = [
  { code: "he", label: "עברית", short: "עב" },
  { code: "en", label: "English", short: "EN" },
] as const

// Persist the chosen locale so the server picks it up on the next request.
function persistLocale(code: string) {
  document.cookie = `NEXT_LOCALE=${code};path=/;max-age=31536000;samesite=lax`
}

/**
 * Persists the chosen locale in a cookie the server reads on the next request,
 * then refreshes so every server component re-renders in the new language.
 */
function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [, startTransition] = useTransition()

  const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0]

  function select(code: string) {
    setOpen(false)
    if (code === locale) return
    persistLocale(code)
    startTransition(() => router.refresh())
  }

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-10 items-center gap-1.5 rounded-full bg-brand-pink-soft px-3.5 text-sm font-extrabold text-secondary-foreground transition hover:brightness-95"
      >
        {current.short} ▾
      </button>

      {open && (
        <>
          {/* Click-away layer */}
          <button
            type="button"
            aria-label="close"
            tabIndex={-1}
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <ul
            role="listbox"
            className="absolute end-0 z-50 mt-2 min-w-[132px] overflow-hidden rounded-2xl border border-border bg-white py-1"
          >
            {LANGUAGES.map((lang) => (
              <li
                key={lang.code}
                role="option"
                aria-selected={lang.code === locale}
              >
                <button
                  type="button"
                  onClick={() => select(lang.code)}
                  className={cn(
                    "flex w-full items-center justify-between px-4 py-2 text-base transition",
                    lang.code === locale
                      ? "bg-brand-pink font-extrabold text-foreground"
                      : "font-bold text-muted-foreground hover:bg-brand-pink/40"
                  )}
                >
                  {lang.label}
                  <span className="text-[13px] opacity-60">{lang.short}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export { LanguageSwitcher }
