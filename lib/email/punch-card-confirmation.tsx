import "server-only"

import { render } from "@react-email/render"
import { getTranslations } from "next-intl/server"
import { Resend } from "resend"

import { PunchCardConfirmationEmail } from "@/components/email/punch-card-confirmation-email"
import { defaultLocale } from "@/i18n/routing"
import { emailAssetsBaseUrl, resendConfig } from "@/lib/env"

export interface PunchCardConfirmation {
  to: string
  cardUrl: string
  entries: number
}

export async function sendPunchCardConfirmation(
  confirmation: PunchCardConfirmation
): Promise<{ sent: true } | { sent: false; error: string }> {
  const config = resendConfig()
  if (!config) return { sent: false, error: "RESEND_API_KEY is not configured" }
  if (!confirmation.to) return { sent: false, error: "No recipient configured" }

  const t = await getTranslations({
    locale: defaultLocale,
    namespace: "emails",
  })

  const email = (
    <PunchCardConfirmationEmail
      locale={defaultLocale}
      baseUrl={emailAssetsBaseUrl()}
      preview={t("punchCard.preview")}
      eyebrow={t("punchCard.eyebrow")}
      heading={t("punchCard.heading")}
      intro={t("punchCard.intro")}
      rows={[
        {
          label: t("punchCard.entriesLabel"),
          value: t("punchCard.entriesValue", { count: confirmation.entries }),
        },
      ]}
      buttonLabel={t("punchCard.viewCard")}
      cardUrl={confirmation.cardUrl}
      signoff={t("punchCard.signoff")}
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
      to: confirmation.to,
      subject: t("punchCard.subject"),
      html,
      text,
    })
    if (error) return { sent: false, error: error.message }
    return { sent: true }
  } catch (error) {
    return { sent: false, error: (error as Error).message }
  }
}
