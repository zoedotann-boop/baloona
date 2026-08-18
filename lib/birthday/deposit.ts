import "server-only"

import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { birthdayContents, leads } from "@/lib/db/schema"
import { getSale } from "@/lib/payme/client"

/**
 * Confirm a birthday deposit was paid and stamp the lead. Idempotent and
 * authoritative: the deposit is re-queried from PayMe, so neither the id alone
 * nor a browser-forged callback marks a lead paid. Called from the PayMe
 * callback (server-side only — deliberately not a `"use server"` action).
 * Returns whether the lead is now marked paid.
 */
export async function confirmDepositPaid(leadId: string): Promise<boolean> {
  const lead = await db.query.leads.findFirst({ where: eq(leads.id, leadId) })
  if (!lead || lead.kind !== "birthday" || !lead.depositSaleId) return false
  if (lead.depositPaidAt) return true

  const content = await db.query.birthdayContents.findFirst({
    where: eq(birthdayContents.locationId, lead.locationId),
    columns: { depositAmount: true },
  })
  const sale = await getSale(lead.depositSaleId)
  if (
    !sale ||
    sale.status !== "completed" ||
    (content && sale.amount !== content.depositAmount)
  ) {
    return false
  }

  await db
    .update(leads)
    .set({ depositPaidAt: new Date() })
    .where(eq(leads.id, leadId))
  return true
}
