import { z } from "zod"

/**
 * Building blocks shared by the admin's save actions.
 *
 * Deliberately not a `"use server"` module: it exports schemas and helpers, and
 * server-action files may only export async functions.
 */

export type ActionResult = { ok: true } | { ok: false; error: string }

export const OK: ActionResult = { ok: true }

export const localizedSchema = z.object({
  he: z.string(),
  en: z.string().optional(),
})

export const localizedListSchema = z.object({
  he: z.array(z.string()),
  en: z.array(z.string()).optional(),
})

/** A row in an editable list: existing rows carry an id, new ones do not. */
export const rowIdSchema = z.uuid().optional()

interface SyncOptions<TRow extends { id?: string }> {
  /** Ids currently stored for this location. */
  existingIds: string[]
  /** The full list as the editor left it, in display order. */
  incoming: TRow[]
  insert: (rows: TRow[]) => Promise<unknown>
  update: (row: TRow & { id: string }) => Promise<unknown>
  remove: (ids: string[]) => Promise<unknown>
}

/**
 * Reconcile an editable list against what is stored.
 *
 * Admin forms submit the whole list rather than per-row edits, because that is
 * what "add a row, drag it up, hit publish" means to the editor. This turns
 * that snapshot into inserts, updates and deletes.
 */
export async function syncCollection<TRow extends { id?: string }>({
  existingIds,
  incoming,
  insert,
  update,
  remove,
}: SyncOptions<TRow>): Promise<void> {
  const keptIds = new Set(
    incoming.map((row) => row.id).filter((id): id is string => Boolean(id))
  )

  const removed = existingIds.filter((id) => !keptIds.has(id))
  if (removed.length > 0) await remove(removed)

  const created = incoming.filter((row) => !row.id)
  if (created.length > 0) await insert(created)

  for (const row of incoming) {
    if (row.id) await update(row as TRow & { id: string })
  }
}
