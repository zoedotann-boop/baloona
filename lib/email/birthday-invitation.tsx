import "server-only"

import { render } from "@react-email/render"
import { getTranslations } from "next-intl/server"
import { Resend } from "resend"

import { BirthdayInvitationEmail } from "@/components/email/birthday-invitation-email"
import { defaultLocale } from "@/i18n/routing"
import { resendConfig } from "@/lib/env"

export interface BirthdayInvitation {
  /** The visitor's own email address, taken from the booking form. */
  to: string
  /** Public URL of the invitation PDF; its bytes are fetched and attached. */
  pdfUrl: string
  /** The celebrant's name, used only in the greeting + subject. */
  celebrantName?: string
}

/** Recipient-facing filename for the attached invitation. */
const ATTACHMENT_FILENAME = "baloona-birthday-invitation.pdf"

/**
 * Email the visitor the ready-made Baloona birthday invitation as a PDF
 * attachment after they submit the booking form.
 *
 * The cover note is the branded {@link BirthdayInvitationEmail} template — it
 * shares the same shell as every other Baloona email. This is a courtesy, not a
 * receipt: like the lead notification it is best-effort and never fails the
 * submission. A missing Resend key or empty recipient is a silent no-op, and any
 * send error is returned for the caller to log rather than surfaced to the
 * visitor. The PDF is a static asset served from `public/`; we fetch its bytes
 * here and attach them inline rather than hand Resend the URL — Resend refuses
 * to download an attachment from `localhost`, so a `path` would work only once
 * deployed.
 */
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
      preview={t("birthdayInvitation.preview")}
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
