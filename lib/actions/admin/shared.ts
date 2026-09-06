import { z } from "zod"

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

export const rowIdSchema = z.uuid().optional()

interface SyncOptions<TRow extends { id?: string }> {
  existingIds: string[]
  incoming: TRow[]
  insert: (rows: TRow[]) => Promise<unknown>
  update: (row: TRow & { id: string }) => Promise<unknown>
  remove: (ids: string[]) => Promise<unknown>
}

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
