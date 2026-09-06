import { Button, Section, Text } from "@react-email/components"
import type { CSSProperties } from "react"

import type { Locale } from "@/i18n/routing"

import { DetailTable, type DetailRow } from "./detail-table"
import { emailTheme } from "./email-theme"
import { EmailLayout } from "./email-layout"

const { color, font } = emailTheme

export interface PunchCardConfirmationEmailProps {
  locale: Locale
  baseUrl?: string
  preview: string
  eyebrow: string
  heading: string
  intro: string
  rows: DetailRow[]
  buttonLabel: string
  cardUrl: string
  signoff: string
  footer: string
}

export function PunchCardConfirmationEmail({
  locale,
  baseUrl,
  preview,
  eyebrow,
  heading,
  intro,
  rows,
  buttonLabel,
  cardUrl,
  signoff,
  footer,
}: PunchCardConfirmationEmailProps) {
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
      <DetailTable rows={rows} />
      <Section style={buttonWrapStyle}>
        <Button href={cardUrl} style={buttonStyle}>
          {buttonLabel}
        </Button>
      </Section>
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

const buttonWrapStyle: CSSProperties = {
  margin: "8px 0 4px",
  textAlign: "center",
}

const buttonStyle: CSSProperties = {
  display: "inline-block",
  backgroundColor: color.accent,
  color: "#ffffff",
  fontFamily: font.heading,
  fontSize: "16px",
  fontWeight: 700,
  textDecoration: "none",
  padding: "14px 30px",
  borderRadius: "999px",
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
