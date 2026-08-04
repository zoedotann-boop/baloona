"use server"

import { and, eq } from "drizzle-orm"
import { z } from "zod"

import { requireLocationAccess } from "@/lib/admin/access"
import { db } from "@/lib/db"
import { leads } from "@/lib/db/schema"

import { OK, type ActionResult } from "./shared"

/** פניות — triaging the inbox. */

const statusSchema = z.object({
  slug: z.string().min(1),
  leadId: z.uuid(),
  status: z.enum(["new", "in_progress", "done", "archived"]),
})

export async function updateLeadStatus(
  input: z.input<typeof statusSchema>
): Promise<ActionResult> {
  const { location } = await requireLocationAccess(input.slug)

  const parsed = statusSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }

  await db
    .update(leads)
    .set({ status: parsed.data.status })
    // Scoped by location so a lead id from another branch cannot be touched.
    .where(
      and(eq(leads.id, parsed.data.leadId), eq(leads.locationId, location.id))
    )

  return OK
}

const deleteSchema = z.object({ slug: z.string().min(1), leadId: z.uuid() })

export async function deleteLead(
  input: z.input<typeof deleteSchema>
): Promise<ActionResult> {
  const { location } = await requireLocationAccess(input.slug)

  const parsed = deleteSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }

  await db
    .delete(leads)
    .where(
      and(eq(leads.id, parsed.data.leadId), eq(leads.locationId, location.id))
    )

  return OK
}
