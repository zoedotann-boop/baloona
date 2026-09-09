import "server-only"

import { render } from "@react-email/render"
import { getTranslations } from "next-intl/server"
import { Resend } from "resend"

import { PunchCardConfirmationEmail } from "@/components/email/punch-card-confirmation-email"
import { defaultLocale } from "@/i18n/routing"
import { emailAssetsBaseUrl, resendConfig } from "@/lib/env"

export interface PunchNotification {
  to: string
  cardUrl: string
  remaining: number
  total: number
  locationName: string
  punchedAt: string
  completed: boolean
}

export async function sendPunchNotification(
  notification: PunchNotification
): Promise<{ sent: true } | { sent: false; error: string }> {
  const config = resendConfig()
  if (!config) return { sent: false, error: "RESEND_API_KEY is not configured" }
  if (!notification.to) return { sent: false, error: "No recipient configured" }

  const t = await getTranslations({
    locale: defaultLocale,
    namespace: "emails",
  })

  const email = (
    <PunchCardConfirmationEmail
      locale={defaultLocale}
      baseUrl={emailAssetsBaseUrl()}
      preview={t("punchNotification.preview")}
      eyebrow={t("punchNotification.eyebrow")}
      heading={
        notification.completed
          ? t("punchNotification.headingCompleted")
          : t("punchNotification.heading")
      }
      intro={
        notification.completed
          ? t("punchNotification.introCompleted")
          : t("punchNotification.intro")
      }
      rows={[
        {
          label: t("punchNotification.locationLabel"),
          value: notification.locationName,
        },
        {
          label: t("punchNotification.whenLabel"),
          value: notification.punchedAt,
        },
        {
          label: t("punchNotification.remainingLabel"),
          value: t("punchNotification.remainingValue", {
            count: notification.remaining,
            total: notification.total,
          }),
        },
      ]}
      buttonLabel={t("punchNotification.viewCard")}
      buttonVariant="pink"
      cardUrl={notification.cardUrl}
      signoff={t("punchNotification.signoff")}
      footer={t("shell.footer")}
    />
  )
  const [html, text] = await Promise.all([
    render(email),
    render(email, { plainText: true }),
  ])

  try {
    const { error } = await new Resend(config.apiKey).emails.send({
      from: config.from,
      to: notification.to,
      subject: t("punchNotification.subject"),
      html,
      text,
    })
    if (error) return { sent: false, error: error.message }
    return { sent: true }
  } catch (error) {
    return { sent: false, error: (error as Error).message }
  }
}
