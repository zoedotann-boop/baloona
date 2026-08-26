"use client"

import { useLocale } from "next-intl"
import { Check, ChevronDown, Globe } from "lucide-react"
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
 *
 * `dropUp` opens the menu above the button — use it in the footer, where a
 * downward menu would spill off the page.
 */
function LanguageSwitcher({
  className,
  dropUp = false,
}: {
  className?: string
  dropUp?: boolean
}) {
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
        aria-label={current.label}
        className="flex h-9 items-center gap-1.5 rounded-full border border-brand-pink bg-brand-pink-soft ps-3 pe-2.5 text-[13px] font-extrabold text-secondary-foreground transition hover:brightness-95"
      >
        <Globe className="size-4 opacity-70" aria-hidden />
        {current.short}
        <ChevronDown
          className={cn("size-3.5 transition-transform", open && "rotate-180")}
          aria-hidden
        />
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
            className={cn(
              "absolute end-0 z-50 min-w-[150px] overflow-hidden rounded-2xl border border-brand-pink bg-brand-pink-soft p-1 shadow-lg shadow-brand-plum/10",
              dropUp ? "bottom-full mb-2" : "mt-2"
            )}
          >
            {LANGUAGES.map((lang) => {
              const active = lang.code === locale
              return (
                <li key={lang.code} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => select(lang.code)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[15px] transition",
                      active
                        ? "bg-brand-pink font-extrabold text-brand-plum"
                        : "font-bold text-brand-plum/70 hover:bg-brand-pink/50"
                    )}
                  >
                    <Check
                      className={cn("size-4 flex-none", !active && "opacity-0")}
                      aria-hidden
                    />
                    <span className="flex-1 text-start">{lang.label}</span>
                    <span className="text-[12px] opacity-60">{lang.short}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}

export { LanguageSwitcher }
