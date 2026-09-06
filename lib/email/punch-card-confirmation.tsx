import "server-only"

import { render } from "@react-email/render"
import { getTranslations } from "next-intl/server"
import { Resend } from "resend"

import { PunchCardConfirmationEmail } from "@/components/email/punch-card-confirmation-email"
import { defaultLocale } from "@/i18n/routing"
import { emailAssetsBaseUrl, resendConfig } from "@/lib/env"

export interface PunchCardConfirmation {
  /** The customer's own email address, from the checkout form. */
  to: string
  /** Absolute link to the customer's digital card (`${origin}/card/<token>`). */
  cardUrl: string
  /** Punches the card grants, shown in the confirmation. */
  entries: number
}

/**
 * Email the customer a confirmation with a link to their new digital punch card,
 * right after it is issued (pay-at-branch checkout or a paid PayMe order).
 *
 * The body is the branded {@link PunchCardConfirmationEmail} template rendered to
 * HTML (with a plain-text alternative) so every Baloona email shares one shell.
 * Like the other customer emails this is best-effort: a missing Resend key or
 * empty recipient is a silent no-op, and any send error is returned for the
 * caller to log rather than surfaced — the card already exists either way.
 */
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
