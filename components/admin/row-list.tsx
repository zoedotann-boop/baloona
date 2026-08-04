"use client"

import { useTranslations } from "next-intl"
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react"

/**
 * An editable, ordered list of rows.
 *
 * Order is expressed by the array itself and turned into `sortOrder` on save,
 * so "move up" is a plain array swap and every list in the admin behaves the
 * same way.
 */

function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length) return items
  const next = [...items]
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)
  return next
}

interface RowListProps<T> {
  items: T[]
  onChange: (items: T[]) => void
  /** Creates the blank row appended by the add button. */
  createItem: () => T
  addLabel: string
  emptyLabel?: string
  renderRow: (
    item: T,
    index: number,
    update: (item: T) => void
  ) => React.ReactNode
}

function RowList<T>({
  items,
  onChange,
  createItem,
  addLabel,
  emptyLabel,
  renderRow,
}: RowListProps<T>) {
  const t = useTranslations("admin.common")

  const update = (index: number, item: T) =>
    onChange(items.map((current, i) => (i === index ? item : current)))

  return (
    <div className="space-y-3">
      {items.length === 0 && emptyLabel && (
        <p className="py-6 text-center text-[14px] text-muted-foreground">
          {emptyLabel}
        </p>
      )}

      {items.map((item, index) => (
        <div
          key={index}
          className="rounded-2xl border border-border bg-muted/40 p-4"
        >
          <div className="mb-3 flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => onChange(moveItem(items, index, index - 1))}
              disabled={index === 0}
              aria-label={t("moveUp")}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-white disabled:opacity-30"
            >
              <ChevronUp className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onChange(moveItem(items, index, index + 1))}
              disabled={index === items.length - 1}
              aria-label={t("moveDown")}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-white disabled:opacity-30"
            >
              <ChevronDown className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              aria-label={t("remove")}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
          {renderRow(item, index, (next) => update(index, next))}
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...items, createItem()])}
        className="flex h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border text-[14px] font-bold text-muted-foreground transition hover:border-primary hover:text-brand-plum"
      >
        <Plus className="size-4" />
        {addLabel}
      </button>
    </div>
  )
}

export { RowList }
