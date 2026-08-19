"use client"

import { useTranslations } from "next-intl"
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from "lucide-react"
import { Fragment, useState } from "react"

import { cn } from "@/lib/utils"

import { useInDialog } from "./admin-dialog"
import { AdminModal } from "./admin-modal"
import {
  adminCell,
  AdminTable,
  AdminTableEmpty,
  AdminTableRow,
} from "./admin-table"
import { ConfirmModal } from "./confirm-modal"

/**
 * An editable, ordered list of rows, shown as a compact table.
 *
 * The table is the summary — a handful of columns an editor scans — and the
 * full form for a row lives behind its edit button. That keeps a section with
 * twenty rows readable on one screen instead of twenty stacked cards, without
 * hiding any of the fields.
 *
 * Where that form opens depends on where the table is. At the top of a section
 * it is a dialog. Inside one — a price tier's rows, a menu category's items, a
 * form field's options — it expands in place instead, because a dialog on top
 * of a dialog is disorienting and hides the parent it belongs to. The table
 * asks {@link useInDialog} rather than taking a prop, so a call site cannot
 * forget, and the same `columns` and `renderRow` serve both.
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
  /** Explains the column on an info icon beside its header. */
  tooltip?: string
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
  /** Heading of the row's editor — usually the row's own name. */
  editTitle: (item: T, index: number) => string
  /** The row's full editor, in a dialog or expanded in place. */
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
  const inDialog = useInDialog()
  const [editing, setEditing] = useState<number | null>(null)
  const [removing, setRemoving] = useState<number | null>(null)

  const update = (index: number, item: T) =>
    onChange(items.map((current, i) => (i === index ? item : current)))

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
    setRemoving(null)
  }

  // A new row is blank, so there is nothing to scan in the table — open it for
  // editing straight away rather than making the editor hunt for the new line.
  function add() {
    onChange([...items, createItem()])
    setEditing(items.length)
  }

  const editingItem = editing === null ? undefined : items[editing]
  const removingItem = removing === null ? undefined : items[removing]
  const span = columns.length + 1

  return (
    <div className="space-y-3">
      <AdminTable
        headers={[
          ...columns.map((column) => ({
            label: column.header,
            className: column.className,
            tooltip: column.tooltip,
          })),
          { label: t("actions"), className: "w-px sr-only" },
        ]}
      >
        {items.length === 0 && (
          <AdminTableEmpty colSpan={span} label={emptyLabel ?? t("empty")} />
        )}

        {items.map((item, index) => (
          <Fragment key={index}>
            <AdminTableRow>
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
                    onClick={() => setEditing(editing === index ? null : index)}
                    aria-label={t("edit")}
                    aria-expanded={inDialog ? editing === index : undefined}
                    className={cn(
                      iconButton,
                      "text-brand-plum hover:bg-white",
                      inDialog && editing === index && "bg-white"
                    )}
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setRemoving(index)}
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

            {/* In-place editor, used instead of a dialog when this table is
                itself inside one. */}
            {inDialog && editing === index && (
              <tr className="border-b border-border bg-muted/30 last:border-0">
                <td colSpan={span} className="px-3 py-3">
                  <div className="space-y-3">
                    {renderRow(item, index, (next) => update(index, next))}
                  </div>
                </td>
              </tr>
            )}

            {/* Likewise the delete confirmation: a second dialog over the first
                would hide the list the row belongs to. */}
            {inDialog && removing === index && (
              <tr className="border-b border-border bg-destructive/5 last:border-0">
                <td colSpan={span} className="px-3 py-2">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-[13px] text-muted-foreground">
                      {t("removeRowMessage")}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setRemoving(null)}
                        className="inline-flex h-8 items-center rounded-full px-3 text-[13px] font-bold text-muted-foreground transition hover:bg-white"
                      >
                        {t("cancel")}
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="inline-flex h-8 items-center rounded-full bg-destructive px-3 text-[13px] font-extrabold text-white transition hover:brightness-110"
                      >
                        {t("remove")}
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </Fragment>
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

      {!inDialog && (
        <>
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

          <ConfirmModal
            open={removingItem !== undefined}
            onClose={() => setRemoving(null)}
            onConfirm={() => removing !== null && remove(removing)}
            title={
              removingItem !== undefined && removing !== null
                ? editTitle(removingItem, removing)
                : ""
            }
            // A row leaves the list now but the deletion only reaches the
            // database on publish, so this must not claim to be final.
            message={t("removeRowMessage")}
          />
        </>
      )}
    </div>
  )
}

export { RowTable }
