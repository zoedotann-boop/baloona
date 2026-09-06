import "server-only"

import { render } from "@react-email/render"
import { getTranslations } from "next-intl/server"
import { Resend } from "resend"

import { BirthdayInvitationEmail } from "@/components/email/birthday-invitation-email"
import { defaultLocale } from "@/i18n/routing"
import { emailAssetsBaseUrl, resendConfig } from "@/lib/env"

export interface BirthdayInvitation {
  to: string
  pdfUrl: string
  celebrantName?: string
}

const ATTACHMENT_FILENAME = "baloona-birthday-invitation.pdf"

export async function sendBirthdayInvitation(
  invitation: BirthdayInvitation
): Promise<{ sent: true } | { sent: false; error: string }> {
  const config = resendConfig()
  if (!config) return { sent: false, error: "RESEND_API_KEY is not configured" }
  if (!invitation.to) return { sent: false, error: "No recipient configured" }

  let content: Buffer
  try {
    const response = await fetch(invitation.pdfUrl)
    if (!response.ok)
      return { sent: false, error: `Invitation PDF ${response.status}` }
    content = Buffer.from(await response.arrayBuffer())
  } catch (error) {
    return { sent: false, error: (error as Error).message }
  }

  const t = await getTranslations({
    locale: defaultLocale,
    namespace: "emails",
  })
  const name = invitation.celebrantName
  const heading = name
    ? t("birthdayInvitation.headingNamed", { name })
    : t("birthdayInvitation.heading")
  const subject = name
    ? t("birthdayInvitation.subjectNamed", { name })
    : t("birthdayInvitation.subject")

  const email = (
    <BirthdayInvitationEmail
      locale={defaultLocale}
      baseUrl={emailAssetsBaseUrl()}
      preview={t("birthdayInvitation.preview")}
      eyebrow={t("birthdayInvitation.eyebrow")}
      heading={heading}
      paragraphs={[t("birthdayInvitation.intro"), t("birthdayInvitation.body")]}
      signoff={t("birthdayInvitation.signoff")}
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
      to: invitation.to,
      subject,
      html,
      text,
      attachments: [{ filename: ATTACHMENT_FILENAME, content }],
    })
    if (error) return { sent: false, error: error.message }
    return { sent: true }
  } catch (error) {
    return { sent: false, error: (error as Error).message }
  }
}
