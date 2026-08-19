"use client"

import { useTranslations } from "next-intl"
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"

import { AdminModal } from "./admin-modal"
import {
  adminCell,
  AdminTable,
  AdminTableEmpty,
  AdminTableRow,
} from "./admin-table"

/**
 * An editable, ordered list of rows, shown as a compact table.
 *
 * The table is the summary — a handful of columns an editor scans — and the
 * full form for a row lives behind its edit button, in a dialog. That keeps a
 * section with twenty rows readable on one screen instead of twenty stacked
 * cards, without hiding any of the fields.
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

interface RowColumn<T> {
  header: string
  cell: (item: T, index: number) => React.ReactNode
  /** Width and alignment utilities, applied to the header and its cells. */
  className?: string
}

interface RowTableProps<T> {
  items: T[]
  onChange: (items: T[]) => void
  /** Creates the blank row appended by the add button. */
  createItem: () => T
  addLabel: string
  emptyLabel?: string
  /** What the table shows for a row without opening it. */
  columns: RowColumn<T>[]
  /** Heading of the row's dialog — usually the row's own name. */
  editTitle: (item: T, index: number) => string
  /** The row's full editor, rendered inside the dialog. */
  renderRow: (
    item: T,
    index: number,
    update: (item: T) => void
  ) => React.ReactNode
}

const iconButton =
  "flex size-8 items-center justify-center rounded-lg text-muted-foreground transition disabled:opacity-30"

function RowTable<T>({
  items,
  onChange,
  createItem,
  addLabel,
  emptyLabel,
  columns,
  editTitle,
  renderRow,
}: RowTableProps<T>) {
  const t = useTranslations("admin.common")
  const [editing, setEditing] = useState<number | null>(null)

  const update = (index: number, item: T) =>
    onChange(items.map((current, i) => (i === index ? item : current)))

  // A new row is blank, so there is nothing to scan in the table — open it for
  // editing straight away rather than making the editor hunt for the new line.
  function add() {
    onChange([...items, createItem()])
    setEditing(items.length)
  }

  const editingItem = editing === null ? undefined : items[editing]

  return (
    <div className="space-y-3">
      <AdminTable
        headers={[
          ...columns.map((column) => ({
            label: column.header,
            className: column.className,
          })),
          { label: t("actions"), className: "w-px sr-only" },
        ]}
      >
        {items.length === 0 && (
          <AdminTableEmpty
            colSpan={columns.length + 1}
            label={emptyLabel ?? t("empty")}
          />
        )}

        {items.map((item, index) => (
          <AdminTableRow key={index}>
            {columns.map((column) => (
              <td
                key={column.header}
                className={cn(adminCell, column.className)}
              >
                {column.cell(item, index)}
              </td>
            ))}
            <td className="px-2 py-1.5">
              <div className="flex items-center justify-end gap-0.5">
                <button
                  type="button"
                  onClick={() => onChange(moveItem(items, index, index - 1))}
                  disabled={index === 0}
                  aria-label={t("moveUp")}
                  className={cn(iconButton, "hover:bg-white")}
                >
                  <ChevronUp className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onChange(moveItem(items, index, index + 1))}
                  disabled={index === items.length - 1}
                  aria-label={t("moveDown")}
                  className={cn(iconButton, "hover:bg-white")}
                >
                  <ChevronDown className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(index)}
                  aria-label={t("edit")}
                  className={cn(iconButton, "text-brand-plum hover:bg-white")}
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onChange(items.filter((_, i) => i !== index))}
                  aria-label={t("remove")}
                  className={cn(
                    iconButton,
                    "hover:bg-destructive/10 hover:text-destructive"
                  )}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </td>
          </AdminTableRow>
        ))}
      </AdminTable>

      <button
        type="button"
        onClick={add}
        className="flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border text-[14px] font-bold text-muted-foreground transition hover:border-primary hover:text-brand-plum"
      >
        <Plus className="size-4" />
        {addLabel}
      </button>

      <AdminModal
        open={editingItem !== undefined}
        onClose={() => setEditing(null)}
        title={
          editingItem !== undefined && editing !== null
            ? editTitle(editingItem, editing)
            : ""
        }
      >
        {editingItem !== undefined &&
          editing !== null &&
          renderRow(editingItem, editing, (next) => update(editing, next))}
      </AdminModal>
    </div>
  )
}

export { RowTable }
