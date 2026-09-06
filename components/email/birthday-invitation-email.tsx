import { Section, Text } from "@react-email/components"
import type { CSSProperties } from "react"

import type { Locale } from "@/i18n/routing"

import { emailTheme } from "./email-theme"
import { EmailLayout } from "./email-layout"

const { color, font } = emailTheme

export interface BirthdayInvitationEmailProps {
  locale: Locale
  baseUrl?: string
  preview: string
  eyebrow: string
  heading: string
  paragraphs: string[]
  signoff: string
  footer: string
}

export function BirthdayInvitationEmail({
  locale,
  baseUrl,
  preview,
  eyebrow,
  heading,
  paragraphs,
  signoff,
  footer,
}: BirthdayInvitationEmailProps) {
  return (
    <EmailLayout
      locale={locale}
      baseUrl={baseUrl}
      preview={preview}
      eyebrow={eyebrow}
      heading={heading}
      footer={footer}
    >
      {paragraphs.map((paragraph, index) => (
        <Text key={index} style={paragraphStyle}>
          {paragraph}
        </Text>
      ))}
      <Section style={signoffStyle}>
        <Text style={signoffTextStyle}>{signoff}</Text>
      </Section>
    </EmailLayout>
  )
}

const paragraphStyle: CSSProperties = {
  margin: "0 0 14px",
  fontFamily: font.body,
  fontSize: "16px",
  lineHeight: "26px",
  color: color.ink,
}

const signoffStyle: CSSProperties = {
  margin: "20px 0 8px",
  padding: "14px 18px",
  borderRadius: "18px",
  backgroundColor: color.pinkSoft,
}

const signoffTextStyle: CSSProperties = {
  margin: 0,
  fontFamily: font.heading,
  fontSize: "15px",
  fontWeight: 700,
  color: color.plum,
}
