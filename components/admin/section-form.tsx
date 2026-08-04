"use client"

import { useTranslations } from "next-intl"
import { Languages, Sparkles } from "lucide-react"
import {
  createContext,
  useCallback,
  useContext,
  useState,
  useTransition,
} from "react"

import { PillButton } from "@/components/brand/pill-button"
import { defaultLocale, type Locale } from "@/i18n/routing"
import { translateForLocation } from "@/lib/actions/admin-tools"
import { translateDraft } from "@/lib/admin/translate-draft"
import { cn } from "@/lib/utils"

const EDITABLE_LOCALES: Locale[] = ["he", "en"]

interface SectionContext {
  slug: string
  locale: Locale
}

const Context = createContext<SectionContext | null>(null)

/** Which language the surrounding form is editing, and for which branch. */
export function useSectionContext(): SectionContext {
  const context = useContext(Context)
  if (!context)
    throw new Error("Admin fields must be rendered inside a <SectionForm>")
  return context
}

interface SectionFormProps<T> {
  slug: string
  title: string
  description?: string
  draft: T
  onDraftChange: (draft: T) => void
  onSave: (draft: T) => Promise<{ ok: boolean; error?: string }>
  children: React.ReactNode
}

/**
 * The frame every admin section shares: a heading, a language switch, the
 * "translate this page with AI" shortcut and the publish bar.
 *
 * Sections hold their whole draft in one state object and publish it in one
 * action — which is what "edit a few things, then hit publish" means to an
 * editor, and keeps each save a single, reviewable payload.
 */
export function SectionForm<T>({
  slug,
  title,
  description,
  draft,
  onDraftChange,
  onSave,
  children,
}: SectionFormProps<T>) {
  const t = useTranslations("admin.common")
  const [locale, setLocale] = useState<Locale>(defaultLocale)
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle")
  const [message, setMessage] = useState<string | null>(null)
  const [saving, startSaving] = useTransition()
  const [translating, startTranslating] = useTransition()

  const translateAll = useCallback(() => {
    setMessage(null)
    startTranslating(async () => {
      const next = await translateDraft(draft, locale, async (values) => {
        const result = await translateForLocation({
          slug,
          values,
          from: defaultLocale,
          to: locale,
        })
        if (!result.ok) {
          setMessage(
            result.error === "missing-key"
              ? t("translateMissingKey")
              : t("translateError")
          )
          return null
        }
        return result.values
      })
      if (next) onDraftChange(next)
    })
  }, [draft, locale, onDraftChange, slug, t])

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(null)
    startSaving(async () => {
      const result = await onSave(draft)
      setStatus(result.ok ? "saved" : "error")
      setMessage(result.ok ? t("saved") : (result.error ?? t("saveError")))
    })
  }

  return (
    <Context.Provider value={{ slug, locale }}>
      <form onSubmit={submit}>
        <header className="mb-6">
          <h1 className="font-heading text-[28px] font-black text-brand-plum">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-[15px] text-muted-foreground">
              {description}
            </p>
          )}
        </header>

        <div className="space-y-5">{children}</div>

        {/* Publish bar. Sticky rather than fixed: it pins to the bottom of the
            content column while there is more form below, then settles at the
            end — and it needs no knowledge of the sidebar's width. */}
        <div className="sticky bottom-0 z-30 -mx-6 mt-5 -mb-8 border-t border-border bg-white/95 backdrop-blur">
          <div className="flex flex-wrap items-center gap-3 px-6 py-3">
            <div
              className="flex items-center gap-1 rounded-full bg-muted p-1"
              role="group"
              aria-label={t("language")}
            >
              <Languages className="mx-1.5 size-4 text-muted-foreground" />
              {EDITABLE_LOCALES.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setLocale(option)}
                  aria-pressed={locale === option}
                  className={cn(
                    "h-8 rounded-full px-3 text-[13px] font-bold uppercase transition",
                    locale === option
                      ? "bg-white text-brand-plum"
                      : "text-muted-foreground"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>

            {locale !== defaultLocale && (
              <button
                type="button"
                onClick={translateAll}
                disabled={translating}
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3.5 text-[13px] font-bold text-brand-plum transition hover:bg-muted disabled:opacity-50"
              >
                <Sparkles className="size-4" />
                {translating ? t("translating") : t("translateAll")}
              </button>
            )}

            {message && (
              <span
                role="status"
                className={cn(
                  "text-[14px] font-bold",
                  status === "error" ? "text-destructive" : "text-brand-green"
                )}
              >
                {message}
              </span>
            )}

            <PillButton
              type="submit"
              size="md"
              disabled={saving}
              className="ms-auto"
            >
              {saving ? t("saving") : t("save")}
            </PillButton>
          </div>
        </div>
      </form>
    </Context.Provider>
  )
}
