"use client"

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useTranslations } from "next-intl"
import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react"
import { Fragment, useId, useState } from "react"

import { cn } from "@/lib/utils"

import { useInDialog } from "./admin-dialog"
import { AdminModal } from "./admin-modal"
import { adminCell, AdminTable, AdminTableEmpty } from "./admin-table"
import { ConfirmModal } from "./confirm-modal"

interface RowColumn<T> {
  header: string
  cell: (item: T, index: number) => React.ReactNode
  className?: string
  tooltip?: string
}

interface RowTableProps<T> {
  items: T[]
  onChange: (items: T[]) => void
  createItem: () => T
  addLabel: string
  emptyLabel?: string
  columns: RowColumn<T>[]
  editTitle: (item: T, index: number) => string
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
  const dndId = useId()
  const [editing, setEditing] = useState<number | null>(null)
  const [removing, setRemoving] = useState<number | null>(null)

  const [rows, setRows] = useState(() => ({
    ids: items.map((_, index) => `row-${index}`),
    next: items.length,
  }))

  if (rows.ids.length !== items.length) {
    setRows((current) => {
      let next = current.next
      return {
        ids: items.map((_, index) => current.ids[index] ?? `row-${next++}`),
        next,
      }
    })
  }
  const ids = rows.ids

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const update = (index: number, item: T) =>
    onChange(items.map((current, i) => (i === index ? item : current)))

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
    setRows((current) => ({
      ...current,
      ids: current.ids.filter((_, i) => i !== index),
    }))
    setRemoving(null)
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return

    const from = ids.indexOf(String(active.id))
    const to = ids.indexOf(String(over.id))
    if (from === -1 || to === -1) return

    onChange(arrayMove(items, from, to))
    setRows((current) => ({
      ...current,
      ids: arrayMove(current.ids, from, to),
    }))
    setEditing((current) =>
      current === null
        ? null
        : arrayMove(
            items.map((_, index) => index),
            from,
            to
          ).indexOf(current)
    )
  }

  function add() {
    onChange([...items, createItem()])
    setRows((current) => ({
      ids: [...current.ids, `row-${current.next}`],
      next: current.next + 1,
    }))
    setEditing(items.length)
  }

  const editingItem = editing === null ? undefined : items[editing]
  const removingItem = removing === null ? undefined : items[removing]
  const span = columns.length + 2

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragEnd={handleDragEnd}
      accessibility={{
        screenReaderInstructions: { draggable: t("reorderInstructions") },
        announcements: {
          onDragStart: ({ active }) =>
            t("reorderStarted", {
              position: ids.indexOf(String(active.id)) + 1,
            }),
          onDragOver: ({ over }) =>
            over
              ? t("reorderMoved", {
                  position: ids.indexOf(String(over.id)) + 1,
                })
              : "",
          onDragEnd: ({ over }) =>
            over
              ? t("reorderEnded", {
                  position: ids.indexOf(String(over.id)) + 1,
                })
              : t("reorderCancelled"),
          onDragCancel: () => t("reorderCancelled"),
        },
      }}
    >
      <div className="space-y-3">
        <AdminTable
          headers={[
            { label: t("reorder"), className: "w-px sr-only" },
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

          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            {items.map((item, index) => (
              <Fragment key={ids[index]}>
                <SortableRow id={ids[index]}>
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
                        onClick={() =>
                          setEditing(editing === index ? null : index)
                        }
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
                </SortableRow>

                {inDialog && editing === index && (
                  <tr className="border-b border-border bg-muted/30 last:border-0">
                    <td colSpan={span} className="px-3 py-3">
                      <div className="space-y-3">
                        {renderRow(item, index, (next) => update(index, next))}
                      </div>
                    </td>
                  </tr>
                )}

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
          </SortableContext>
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
                renderRow(editingItem, editing, (next) =>
                  update(editing, next)
                )}
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
              message={t("removeRowMessage")}
            />
          </>
        )}
      </div>
    </DndContext>
  )
}

function SortableRow({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  const t = useTranslations("admin.common")
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  return (
    <tr
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "border-b border-border transition-colors last:border-0 hover:bg-muted/30",
        isDragging && "relative z-10 bg-white shadow-md"
      )}
    >
      <td className="w-px ps-2">
        <button
          ref={setActivatorNodeRef}
          type="button"
          aria-label={t("reorder")}
          {...attributes}
          {...listeners}
          className={cn(
            iconButton,
            "cursor-grab touch-none hover:bg-white active:cursor-grabbing"
          )}
        >
          <GripVertical className="size-4" />
        </button>
      </td>
      {children}
    </tr>
  )
}

export { RowTable }
