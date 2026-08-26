import "server-only"

import { render } from "@react-email/render"
import { Resend } from "resend"

import {
  LeadNotificationEmail,
  type LeadNotificationEmailProps,
} from "@/components/email/lead-notification-email"
import { resendConfig } from "@/lib/env"

export interface LeadNotification extends LeadNotificationEmailProps {
  to: string
  subject: string
}

/**
 * Email a new lead to the address configured for that location.
 *
 * The body is the branded {@link LeadNotificationEmail} template rendered to
 * HTML (with a plain-text alternative) so every Baloona email shares one shell.
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

  const { to, subject, ...emailProps } = notification
  const email = <LeadNotificationEmail {...emailProps} />
  const [html, text] = await Promise.all([
    render(email),
    render(email, { plainText: true }),
  ])

  try {
    const { error } = await new Resend(config.apiKey).emails.send({
      from: config.from,
      to,
      subject,
      html,
      text,
    })
    if (error) return { sent: false, error: error.message }
    return { sent: true }
  } catch (error) {
    return { sent: false, error: (error as Error).message }
  }
}
