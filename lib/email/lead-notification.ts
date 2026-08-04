import "server-only"

import { Resend } from "resend"

import { resendConfig } from "@/lib/env"

export interface LeadNotification {
  to: string
  locationName: string
  heading: string
  /** Ordered detail rows, already labelled in Hebrew. */
  rows: { label: string; value: string }[]
}

/**
 * Email a new lead to the address configured for that location.
 *
 * Notification failures never fail the submission: the lead is already stored,
 * and the admin inbox is the source of truth. The error is recorded on the lead
 * so it is visible rather than silent.
 */
export async function sendLeadNotification(
  notification: LeadNotification
): Promise<{ sent: true } | { sent: false; error: string }> {
  const config = resendConfig()
  if (!config) return { sent: false, error: "RESEND_API_KEY is not configured" }
  if (!notification.to) return { sent: false, error: "No recipient configured" }

  const rows = notification.rows
    .filter((row) => row.value.trim())
    .map(
      (row) =>
        `<tr><td style="padding:6px 12px;color:#6b6b7b;white-space:nowrap">${escapeHtml(row.label)}</td>` +
        `<td style="padding:6px 12px;font-weight:600">${escapeHtml(row.value)}</td></tr>`
    )
    .join("")

  const html = `<div dir="rtl" style="font-family:Arial,Helvetica,sans-serif;color:#2f2a3d">
  <h2 style="margin:0 0 4px">${escapeHtml(notification.heading)}</h2>
  <p style="margin:0 0 16px;color:#6b6b7b">${escapeHtml(notification.locationName)}</p>
  <table style="border-collapse:collapse;font-size:15px">${rows}</table>
</div>`

  try {
    const { error } = await new Resend(config.apiKey).emails.send({
      from: config.from,
      to: notification.to,
      subject: `${notification.heading} · ${notification.locationName}`,
      html,
    })
    if (error) return { sent: false, error: error.message }
    return { sent: true }
  } catch (error) {
    return { sent: false, error: (error as Error).message }
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}
