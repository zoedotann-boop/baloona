"use client"

import { useTranslations } from "next-intl"
import { Plus, Sparkles, Trash2 } from "lucide-react"
import { useTransition } from "react"

import { AdminField, AdminInput, AdminTextarea } from "./admin-ui"
import { useSectionContext } from "./section-form"
import { defaultLocale } from "@/i18n/routing"
import { translateForLocation } from "@/lib/actions/admin-tools"
import type { Localized, LocalizedList } from "@/lib/localized"

/** "Fill with AI" — shown only while editing a language other than Hebrew. */
function TranslateButton({
  sources,
  onTranslated,
}: {
  sources: string[]
  onTranslated: (values: string[]) => void
}) {
  const t = useTranslations("admin.common")
  const { slug, locale } = useSectionContext()
  const [pending, start] = useTransition()

  if (locale === defaultLocale) return null

  return (
    <button
      type="button"
      disabled={pending || sources.every((value) => !value.trim())}
      onClick={() =>
        start(async () => {
          const result = await translateForLocation({
            slug,
            values: sources,
            from: defaultLocale,
            to: locale,
          })
          if (result.ok) onTranslated(result.values)
        })
      }
      className="inline-flex items-center gap-1 text-[12px] font-bold text-primary transition hover:opacity-80 disabled:opacity-40"
    >
      <Sparkles className="size-3.5" />
      {pending ? t("translating") : t("translate")}
    </button>
  )
}

interface LocalizedFieldProps {
  label: string
  hint?: string
  value: Localized
  onChange: (value: Localized) => void
  multiline?: boolean
  rows?: number
  placeholder?: string
  className?: string
}

/**
 * A translatable text field. It edits whichever language the section is set to,
 * so switching language once re-labels the whole page rather than making the
 * editor toggle every input.
 */
function LocalizedField({
  label,
  hint,
  value,
  onChange,
  multiline = false,
  rows = 3,
  placeholder,
  className,
}: LocalizedFieldProps) {
  const { locale } = useSectionContext()
  const current = value[locale] ?? ""

  const update = (next: string) => onChange({ ...value, [locale]: next })

  return (
    <AdminField
      label={label}
      hint={hint}
      className={className}
      action={
        <TranslateButton
          sources={[value[defaultLocale] ?? ""]}
          onTranslated={([translated]) => update(translated)}
        />
      }
    >
      {multiline ? (
        <AdminTextarea
          rows={rows}
          value={current}
          placeholder={placeholder}
          onChange={(event) => update(event.target.value)}
        />
      ) : (
        <AdminInput
          value={current}
          placeholder={placeholder}
          onChange={(event) => update(event.target.value)}
        />
      )}
    </AdminField>
  )
}

interface LocalizedListFieldProps {
  label: string
  hint?: string
  value: LocalizedList
  onChange: (value: LocalizedList) => void
  addLabel: string
}

/** A translatable list of short lines (pop-up bullets, pricing rules, rules). */
function LocalizedListField({
  label,
  hint,
  value,
  onChange,
  addLabel,
}: LocalizedListFieldProps) {
  const t = useTranslations("admin.common")
  const { locale } = useSectionContext()
  const source = value[defaultLocale] ?? []
  const lines = value[locale] ?? []

  // Rows are indexed positionally across languages, so keep the arrays aligned.
  const length = Math.max(source.length, lines.length)
  const rows = Array.from({ length }, (_, index) => lines[index] ?? "")

  const write = (next: string[]) => onChange({ ...value, [locale]: next })

  const update = (index: number, next: string) =>
    write(rows.map((line, i) => (i === index ? next : line)))

  const add = () => {
    const appended = [...rows, ""]
    onChange(
      locale === defaultLocale
        ? { ...value, [locale]: appended }
        : { ...value, [defaultLocale]: [...source, ""], [locale]: appended }
    )
  }

  const remove = (index: number) =>
    onChange({
      ...value,
      [defaultLocale]: source.filter((_, i) => i !== index),
      [locale]: rows.filter((_, i) => i !== index),
    })

  return (
    <AdminField
      label={label}
      hint={hint}
      action={
        <TranslateButton
          sources={source}
          onTranslated={(values) => write(values)}
        />
      }
    >
      <div className="space-y-2">
        {rows.map((line, index) => (
          <div key={index} className="flex items-center gap-2">
            <AdminInput
              aria-label={`${label} ${index + 1}`}
              value={line}
              onChange={(event) => update(index, event.target.value)}
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              aria-label={t("remove")}
              className="flex size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border text-[14px] font-bold text-muted-foreground transition hover:border-primary hover:text-brand-plum"
        >
          <Plus className="size-4" />
          {addLabel}
        </button>
      </div>
    </AdminField>
  )
}

export { LocalizedField, LocalizedListField }
