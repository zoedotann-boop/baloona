import "server-only"

import { render } from "@react-email/render"
import { Resend } from "resend"

import {
  LeadNotificationEmail,
  type LeadNotificationEmailProps,
} from "@/components/email/lead-notification-email"
import { emailAssetsBaseUrl, resendConfig } from "@/lib/env"

export interface LeadNotification extends LeadNotificationEmailProps {
  to: string
  subject: string
}

export async function sendLeadNotification(
  notification: LeadNotification
): Promise<{ sent: true } | { sent: false; error: string }> {
  const config = resendConfig()
  if (!config) return { sent: false, error: "RESEND_API_KEY is not configured" }
  if (!notification.to) return { sent: false, error: "No recipient configured" }

  const { to, subject, ...emailProps } = notification
  const email = (
    <LeadNotificationEmail {...emailProps} baseUrl={emailAssetsBaseUrl()} />
  )
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
