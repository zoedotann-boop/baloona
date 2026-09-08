import "server-only"

import { render } from "@react-email/render"
import { getTranslations } from "next-intl/server"
import { Resend } from "resend"

import { BirthdayInvitationEmail } from "@/components/email/birthday-invitation-email"
import { defaultLocale } from "@/i18n/routing"
import { fillBirthdayInvitation } from "@/lib/email/fill-birthday-invitation"
import { emailAssetsBaseUrl, resendConfig } from "@/lib/env"

export interface BirthdayInvitation {
  to: string
  pdfUrl: string
  celebrantName?: string
  eventDate?: string
}

const ATTACHMENT_FILENAME = "baloona-birthday-invitation.pdf"
const FONT_PATH = "/fonts/Assistant-SemiBold.ttf"

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

  const weekdays = t.raw("birthdayInvitation.weekdays") as string[]
  content = await personalize(content, invitation, name, weekdays)

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

async function personalize(
  original: Buffer,
  invitation: BirthdayInvitation,
  name: string | undefined,
  weekdays: string[]
): Promise<Buffer> {
  const eventDate = parseEventDate(invitation.eventDate)
  if (!name && !eventDate) return original
  try {
    const response = await fetch(new URL(FONT_PATH, invitation.pdfUrl))
    if (!response.ok) return original
    const fontBytes = new Uint8Array(await response.arrayBuffer())
    const filled = await fillBirthdayInvitation(original, fontBytes, {
      name,
      day: eventDate ? weekdays[eventDate.getDay()] : undefined,
      date: eventDate ? formatEventDate(eventDate) : undefined,
    })
    return Buffer.from(filled)
  } catch {
    return original
  }
}

function parseEventDate(value: string | undefined): Date | null {
  if (!value) return null
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
  if (!match) return null
  const [, year, month, day] = match
  return new Date(Number(year), Number(month) - 1, Number(day))
}

function formatEventDate(date: Date): string {
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
}
