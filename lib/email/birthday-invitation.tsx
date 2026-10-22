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
  eventTime?: string
  address?: string
  phone?: string
}

const ATTACHMENT_FILENAME = "baloona-birthday-invitation.pdf"
const FONT_PATH = "/fonts/Fredoka-Medium.ttf"
const WEBSITE = "www.baloona.co.il"

export async function sendBirthdayInvitation(
  invitation: BirthdayInvitation
): Promise<{ sent: true } | { sent: false; error: string }> {
  const config = resendConfig()
  if (!config) return { sent: false, error: "RESEND_API_KEY is not configured" }
  if (!invitation.to) return { sent: false, error: "No recipient configured" }

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

  let content: Buffer
  try {
    content = await invitationPdf(invitation, {
      weekdays: t.raw("birthdayInvitation.weekdays") as string[],
      footer: [
        invitation.phone &&
          t("birthdayInvitation.phone", { phone: invitation.phone }),
        WEBSITE,
      ]
        .filter(Boolean)
        .join(" | "),
    })
  } catch (error) {
    return { sent: false, error: (error as Error).message }
  }

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

async function invitationPdf(
  invitation: BirthdayInvitation,
  copy: { weekdays: string[]; footer: string }
): Promise<Buffer> {
  const [pdfBytes, fontBytes] = await Promise.all([
    fetchBytes(invitation.pdfUrl),
    fetchBytes(new URL(FONT_PATH, invitation.pdfUrl)),
  ])
  const eventDate = parseEventDate(invitation.eventDate)
  const filled = await fillBirthdayInvitation(pdfBytes, fontBytes, {
    name: invitation.celebrantName,
    day: eventDate ? copy.weekdays[eventDate.getDay()] : undefined,
    date: eventDate ? formatEventDate(eventDate) : undefined,
    time: invitation.eventTime || undefined,
    address: invitation.address,
    footer: copy.footer,
  })
  return Buffer.from(filled)
}

async function fetchBytes(url: string | URL): Promise<Uint8Array> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${url} ${response.status}`)
  return new Uint8Array(await response.arrayBuffer())
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
