"use server"

import { eq, inArray } from "drizzle-orm"
import { getTranslations } from "next-intl/server"
import { z } from "zod"

import { defaultLocale } from "@/i18n/routing"
import { db } from "@/lib/db"
import {
  birthdayFormFields,
  birthdayUpgrades,
  leads,
  locations,
} from "@/lib/db/schema"
import { sendBirthdayInvitation } from "@/lib/email/birthday-invitation"
import { sendLeadNotification } from "@/lib/email/lead-notification"
import { contactLeadSchema } from "@/lib/forms/schemas"
import { isHoneypotFilled } from "@/lib/forms/honeypot"
import { pickLocale } from "@/lib/localized"
import { siteOrigin } from "@/lib/site-url"
import {
  buildObjectKey,
  isStorageConfigured,
  uploadObject,
} from "@/lib/storage"

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

// react-doctor-disable-next-line react-doctor/server-auth-actions -- public form
export async function submitContactLead(
  input: z.input<typeof contactLeadSchema>
): Promise<SubmitResult> {
  const parsed = contactLeadSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }
  const data = parsed.data
  // Drop bot submissions silently — the honeypot is invisible to humans.
  if (isHoneypotFilled(data.honeypot)) return { ok: true }

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

  const t = await getTranslations({
    locale: defaultLocale,
    namespace: "emails",
  })
  const locationName = pickLocale(location.name, defaultLocale)
  const heading = t("lead.contact.heading")
  await notify(lead.id, {
    to: location.contact?.leadRecipientEmail || location.contact?.email || "",
    subject: `${heading} · ${locationName}`,
    locale: defaultLocale,
    heading,
    preview: t("lead.contact.preview"),
    footer: t("shell.footer"),
    locationName,
    rows: [
      { label: t("lead.labels.name"), value: data.fullName },
      { label: t("lead.labels.phone"), value: data.phone },
      { label: t("lead.labels.subject"), value: data.subject ?? "" },
      { label: t("lead.labels.message"), value: data.message },
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
  honeypot: z.string().optional(),
})

// react-doctor-disable-next-line react-doctor/server-auth-actions -- public form
export async function submitBirthdayLead(
  input: z.input<typeof birthdaySchema>
): Promise<SubmitResult> {
  const parsed = birthdaySchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }
  const data = parsed.data
  // Drop bot submissions silently — the honeypot is invisible to humans.
  if (isHoneypotFilled(data.honeypot)) return { ok: true }

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

  const t = await getTranslations({
    locale: defaultLocale,
    namespace: "emails",
  })
  const locationName = pickLocale(location.name, defaultLocale)
  const heading = t("lead.birthday.heading")
  await notify(lead.id, {
    to: location.contact?.leadRecipientEmail || location.contact?.email || "",
    subject: `${heading} · ${locationName}`,
    locale: defaultLocale,
    heading,
    preview: t("lead.birthday.preview"),
    footer: t("shell.footer"),
    locationName,
    rows: [
      ...visible.map((field) => ({
        label: pickLocale(field.label, defaultLocale),
        value: answers[field.key] ?? "",
      })),
      {
        label: t("lead.labels.upgrades"),
        value: selectedUpgrades.map((upgrade) => upgrade.label).join(", "),
      },
      { label: t("lead.labels.estimatedTotal"), value: `${totalAmount} ₪` },
    ],
  })

  // Courtesy invitation PDF to the visitor's own email — best-effort, so a
  // failure is logged rather than allowed to fail an already-stored booking.
  if (answers.email) {
    const result = await sendBirthdayInvitation({
      to: answers.email,
      pdfUrl: `${await siteOrigin()}/birthday-invitation.pdf`,
      celebrantName: answers.celebrantNames || undefined,
    })
    if (!result.sent) console.error("birthday invitation email:", result.error)
  }

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
