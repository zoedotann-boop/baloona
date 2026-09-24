import { Section, Text } from "@react-email/components"
import type { CSSProperties } from "react"

import type { Locale } from "@/i18n/routing"

import { emailTheme } from "./email-theme"
import { EmailLayout } from "./email-layout"

const { color, font } = emailTheme

export interface LoginOtpEmailProps {
  locale: Locale
  baseUrl?: string
  preview: string
  eyebrow: string
  heading: string
  intro: string
  otp: string
  expiry: string
  footer: string
}

export function LoginOtpEmail({
  locale,
  baseUrl,
  preview,
  eyebrow,
  heading,
  intro,
  otp,
  expiry,
  footer,
}: LoginOtpEmailProps) {
  return (
    <EmailLayout
      locale={locale}
      baseUrl={baseUrl}
      preview={preview}
      eyebrow={eyebrow}
      heading={heading}
      footer={footer}
    >
      <Text style={paragraphStyle}>{intro}</Text>
      <Section style={codeWrapStyle}>
        <Text style={codeStyle}>{otp}</Text>
      </Section>
      <Text style={expiryStyle}>{expiry}</Text>
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

const codeWrapStyle: CSSProperties = {
  margin: "8px 0 16px",
  padding: "18px",
  borderRadius: "18px",
  backgroundColor: color.pinkSoft,
  textAlign: "center",
}

const codeStyle: CSSProperties = {
  margin: 0,
  fontFamily: font.heading,
  fontSize: "34px",
  fontWeight: 700,
  letterSpacing: "0.4em",
  color: color.plum,
}

const expiryStyle: CSSProperties = {
  margin: "0 0 8px",
  fontFamily: font.body,
  fontSize: "14px",
  lineHeight: "22px",
  color: color.inkSoft,
}
