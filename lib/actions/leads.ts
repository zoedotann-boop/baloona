"use server"

import { eq, inArray } from "drizzle-orm"
import { z } from "zod"

import { defaultLocale } from "@/i18n/routing"
import { db } from "@/lib/db"
import {
  birthdayFormFields,
  birthdayUpgrades,
  leads,
  locations,
} from "@/lib/db/schema"
import { sendLeadNotification } from "@/lib/email/lead-notification"
import { pickLocale } from "@/lib/localized"
import {
  buildObjectKey,
  isStorageConfigured,
  uploadObject,
} from "@/lib/storage/r2"

/**
 * Public form submissions.
 *
 * Both actions store the lead first and notify second: the admin inbox is the
 * source of truth, so a Resend outage must never lose an enquiry. Email
 * failures are recorded on the lead row instead of surfacing to the visitor.
 */

export type SubmitResult = { ok: true } | { ok: false; error: string }

// These two actions are deliberately unauthenticated: they back the site's
// public contact and booking forms, which anonymous visitors submit. They only
// ever insert a new lead scoped to a validated location id — they never read or
// mutate existing records — so there is nothing for a caller to reach that the
// forms do not already expose.

const contactSchema = z.object({
  locationId: z.uuid(),
  fullName: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(6).max(40),
  subject: z.string().trim().max(120).optional(),
  message: z.string().trim().min(1).max(4000),
})

// react-doctor-disable-next-line react-doctor/server-auth-actions -- public form
export async function submitContactLead(
  input: z.input<typeof contactSchema>
): Promise<SubmitResult> {
  const parsed = contactSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }
  const data = parsed.data

  const location = await db.query.locations.findFirst({
    where: eq(locations.id, data.locationId),
    with: { contact: true },
  })
  if (!location) return { ok: false, error: "invalid" }

  const [lead] = await db
    .insert(leads)
    .values({
      locationId: location.id,
      kind: "contact",
      fullName: data.fullName,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
    })
    .returning({ id: leads.id })

  await notify(lead.id, {
    to: location.contact?.leadRecipientEmail || location.contact?.email || "",
    locationName: pickLocale(location.name, defaultLocale),
    heading: "פנייה חדשה מהאתר",
    rows: [
      { label: "שם", value: data.fullName },
      { label: "טלפון", value: data.phone },
      { label: "נושא", value: data.subject ?? "" },
      { label: "הודעה", value: data.message },
    ],
  })

  return { ok: true }
}

const birthdaySchema = z.object({
  locationId: z.uuid(),
  answers: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
  upgradeIds: z.array(z.uuid()).default([]),
  consent: z.boolean(),
  /** `data:image/png;base64,…` produced by the signature pad. */
  signature: z.string().startsWith("data:image/").optional(),
})

// react-doctor-disable-next-line react-doctor/server-auth-actions -- public form
export async function submitBirthdayLead(
  input: z.input<typeof birthdaySchema>
): Promise<SubmitResult> {
  const parsed = birthdaySchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }
  const data = parsed.data

  const location = await db.query.locations.findFirst({
    where: eq(locations.id, data.locationId),
    with: { contact: true, birthday: true },
  })
  if (!location?.birthday) return { ok: false, error: "invalid" }
  if (!data.consent) return { ok: false, error: "consent" }
  if (location.birthday.requiresSignature && !data.signature)
    return { ok: false, error: "signature" }

  // The form's shape is editor-defined, so validate the submission against the
  // stored field rows rather than trusting the payload's keys.
  const fields = await db.query.birthdayFormFields.findMany({
    where: eq(birthdayFormFields.locationId, location.id),
  })
  const visible = fields.filter((field) => field.isVisible)

  const answers: Record<string, string> = {}
  for (const field of visible) {
    const raw = data.answers[field.key]
    const value = raw === undefined || raw === null ? "" : String(raw).trim()
    if (field.isRequired && !value) return { ok: false, error: "required" }
    if (value) answers[field.key] = value
  }

  const chosen = data.upgradeIds.length
    ? await db.query.birthdayUpgrades.findMany({
        where: inArray(birthdayUpgrades.id, data.upgradeIds),
      })
    : []
  const selectedUpgrades = chosen
    .filter((upgrade) => upgrade.locationId === location.id)
    .map((upgrade) => ({
      label: pickLocale(upgrade.label, defaultLocale),
      amount: upgrade.amount,
    }))

  const totalAmount =
    location.birthday.packageAmount +
    selectedUpgrades.reduce((sum, upgrade) => sum + upgrade.amount, 0)

  const signatureUrl = data.signature
    ? await storeSignature(location.slug, data.signature)
    : null

  const [lead] = await db
    .insert(leads)
    .values({
      locationId: location.id,
      kind: "birthday",
      fullName: answers.fullName ?? "",
      phone: answers.phone ?? "",
      email: answers.email ?? "",
      formData: answers,
      selectedUpgrades,
      totalAmount,
      signatureUrl,
      consentAcceptedAt: new Date(),
    })
    .returning({ id: leads.id })

  await notify(lead.id, {
    to: location.contact?.leadRecipientEmail || location.contact?.email || "",
    locationName: pickLocale(location.name, defaultLocale),
    heading: "בקשת יום הולדת חדשה",
    rows: [
      ...visible.map((field) => ({
        label: pickLocale(field.label, defaultLocale),
        value: answers[field.key] ?? "",
      })),
      {
        label: "תוספות",
        value: selectedUpgrades.map((upgrade) => upgrade.label).join(", "),
      },
      { label: "סכום משוער", value: `${totalAmount} ₪` },
    ],
  })

  return { ok: true }
}

/** Persist the signature PNG so the lead keeps a copy of what was signed. */
async function storeSignature(
  locationSlug: string,
  dataUrl: string
): Promise<string | null> {
  if (!isStorageConfigured()) return null
  const [header, base64] = dataUrl.split(",")
  if (!base64) return null
  const contentType = header.slice(5, header.indexOf(";")) || "image/png"
  return uploadObject(
    buildObjectKey(locationSlug, "signatures", "signature.png"),
    contentType,
    Uint8Array.from(Buffer.from(base64, "base64"))
  )
}

async function notify(
  leadId: string,
  notification: Parameters<typeof sendLeadNotification>[0]
) {
  const result = await sendLeadNotification(notification)
  await db
    .update(leads)
    .set(
      result.sent
        ? { notifiedAt: new Date(), notifyError: null }
        : { notifyError: result.error }
    )
    .where(eq(leads.id, leadId))
}
