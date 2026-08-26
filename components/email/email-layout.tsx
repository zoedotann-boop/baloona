import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"
import type { CSSProperties, ReactNode } from "react"

import { type Locale, localeDir } from "@/i18n/routing"

import { emailTheme } from "./email-theme"

const { color, font, radius } = emailTheme

export interface EmailLayoutProps {
  /** Locale the email is written in — drives `lang` and RTL/LTR direction. */
  locale: Locale
  /** Inbox preview line (rendered hidden, before the body). */
  preview: string
  /** Card title, shown under the wordmark. */
  heading: string
  /** Optional line under the heading — typically the venue name. */
  subheading?: string
  /** Shared footer copy, supplied by the caller so this stays copy-free. */
  footer: string
  children: ReactNode
}

/**
 * The shell every Baloona email shares: RTL, the brand near-white background, a
 * centred white card, the Fredoka wordmark header over a candy accent bar, and
 * a muted footer. Templates provide only the card body via `children`; all copy
 * (heading/subheading/footer/preview) arrives as props because emails render
 * outside the next-intl provider.
 */
export function EmailLayout({
  locale,
  preview,
  heading,
  subheading,
  footer,
  children,
}: EmailLayoutProps) {
  return (
    <Html dir={localeDir(locale)} lang={locale}>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Text style={wordmarkStyle}>Baloona</Text>
          </Section>
          <Section style={accentBarStyle} />
          <Section style={cardBodyStyle}>
            <Heading as="h1" style={headingStyle}>
              {heading}
            </Heading>
            {subheading ? (
              <Text style={subheadingStyle}>{subheading}</Text>
            ) : null}
            {children}
          </Section>
          <Hr style={hrStyle} />
          <Section style={footerStyle}>
            <Text style={footerTextStyle}>{footer}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const bodyStyle: CSSProperties = {
  margin: 0,
  padding: "32px 16px",
  backgroundColor: color.background,
  fontFamily: font.body,
  color: color.ink,
}

const containerStyle: CSSProperties = {
  width: "100%",
  maxWidth: "560px",
  margin: "0 auto",
  backgroundColor: color.card,
  borderRadius: radius,
  border: `1px solid ${color.border}`,
  overflow: "hidden",
}

const headerStyle: CSSProperties = {
  padding: "28px 32px 20px",
  textAlign: "center",
  backgroundColor: color.lavenderSoft,
}

const wordmarkStyle: CSSProperties = {
  margin: 0,
  fontFamily: font.heading,
  fontSize: "30px",
  fontWeight: 700,
  letterSpacing: "0.5px",
  color: color.plum,
}

const accentBarStyle: CSSProperties = {
  height: "6px",
  backgroundColor: color.rose,
  backgroundImage: `linear-gradient(90deg, ${color.rose} 0%, ${color.pink} 33%, ${color.lavender} 66%, ${color.mint} 100%)`,
}

const cardBodyStyle: CSSProperties = {
  padding: "28px 32px 8px",
}

const headingStyle: CSSProperties = {
  margin: "0 0 4px",
  fontFamily: font.heading,
  fontSize: "22px",
  fontWeight: 700,
  color: color.plum,
}

const subheadingStyle: CSSProperties = {
  margin: "0 0 20px",
  fontSize: "15px",
  color: color.inkSoft,
}

const hrStyle: CSSProperties = {
  margin: "8px 0 0",
  border: "none",
  borderTop: `1px solid ${color.border}`,
}

const footerStyle: CSSProperties = {
  padding: "16px 32px 24px",
  textAlign: "center",
}

const footerTextStyle: CSSProperties = {
  margin: 0,
  fontSize: "12px",
  color: color.mutedInk,
}
