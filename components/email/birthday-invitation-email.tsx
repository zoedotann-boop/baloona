import { Text } from "@react-email/components"
import type { CSSProperties } from "react"

import type { Locale } from "@/i18n/routing"

import { emailTheme } from "./email-theme"
import { EmailLayout } from "./email-layout"

const { color, font } = emailTheme

export interface BirthdayInvitationEmailProps {
  /** Locale the invitation is written in. */
  locale: Locale
  /** Inbox preview line. */
  preview: string
  /** Warm greeting headline (may include the celebrant's name). */
  heading: string
  /** Body paragraphs shown under the heading, in order. */
  paragraphs: string[]
  /** Closing line, e.g. "See you soon, the Baloona team". */
  signoff: string
  /** Shared footer copy. */
  footer: string
}

/**
 * Courtesy email sent to a visitor after they book a birthday: the ready-made
 * Baloona invitation rides along as a PDF attachment, and this is the branded
 * cover note. Built on the shared {@link EmailLayout} so it matches every other
 * Baloona email.
 */
export function BirthdayInvitationEmail({
  locale,
  preview,
  heading,
  paragraphs,
  signoff,
  footer,
}: BirthdayInvitationEmailProps) {
  return (
    <EmailLayout
      locale={locale}
      preview={preview}
      heading={heading}
      footer={footer}
    >
      {paragraphs.map((paragraph, index) => (
        <Text key={index} style={paragraphStyle}>
          {paragraph}
        </Text>
      ))}
      <Text style={signoffStyle}>{signoff}</Text>
    </EmailLayout>
  )
}

const paragraphStyle: CSSProperties = {
  margin: "0 0 12px",
  fontFamily: font.body,
  fontSize: "16px",
  lineHeight: "24px",
  color: color.ink,
}

const signoffStyle: CSSProperties = {
  margin: "20px 0 0",
  fontFamily: font.body,
  fontSize: "14px",
  fontWeight: 600,
  color: color.plum,
}
