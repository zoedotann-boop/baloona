import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
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
  /**
   * Absolute origin the logo + background are loaded from (e.g.
   * `https://baloona.co.il`). Left blank in Storybook, where `public/` is served
   * at the root; production senders pass {@link emailAssetsBaseUrl}.
   */
  baseUrl?: string
  /** Inbox preview line (rendered hidden, before the body). */
  preview: string
  /** Optional pill above the heading — the site's eyebrow badge, e.g. a label. */
  eyebrow?: string
  /** Card title, shown under the wordmark. */
  heading: string
  /** Optional line under the heading — typically the venue name. */
  subheading?: string
  /** Shared footer copy, supplied by the caller so this stays copy-free. */
  footer: string
  children: ReactNode
}

/**
 * The shell every Baloona email shares, tuned to read like the site: the Baloona
 * wordmark logo sitting on the cream "cream-rainbow" hero background used across
 * the site, a candy accent bar, an eyebrow pill + plum heading, and a footer
 * closed by a row of brand dots. The Fredoka + Assistant brand fonts load from
 * Google Fonts (clients that honour web fonts render them; the rest fall back to
 * the inline stacks). Everything is inline-styled, RTL-aware and table-safe.
 *
 * Templates provide only the card body via `children`; all copy
 * (eyebrow/heading/subheading/footer/preview) arrives as props because emails
 * render outside the next-intl provider.
 */
export function EmailLayout({
  locale,
  baseUrl = "",
  preview,
  eyebrow,
  heading,
  subheading,
  footer,
  children,
}: EmailLayoutProps) {
  const dir = localeDir(locale)
  const start = dir === "rtl" ? "right" : "left"
  const asset = (path: string) => `${baseUrl}${path}`

  return (
    <Html dir={dir} lang={locale}>
      <Head>
        {/* Brand fonts for clients that honour <link> web fonts (Apple Mail,
            iOS). Gmail strips <head> styles, so it uses the inline fallbacks.
            This is an email document, not a Next.js page — the page-font rule
            (which points at pages/_document) does not apply. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;600;700&family=Fredoka:wght@500;600;700&display=swap"
        />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={bodyStyle} dir={dir}>
        <Container style={containerStyle}>
          <Section
            style={{
              ...headerStyle,
              backgroundImage: `url(${asset("/assets/bg-cream-rainbow.png")})`,
            }}
          >
            <Img
              src={asset("/assets/brand/logo.png")}
              alt="Baloona"
              width={168}
              height={59}
              style={logoStyle}
            />
          </Section>
          <Section style={accentBarStyle} />
          <Section style={cardBodyStyle}>
            {eyebrow ? (
              <table
                role="presentation"
                cellPadding={0}
                cellSpacing={0}
                style={{ marginBottom: "14px" }}
              >
                <tbody>
                  <tr>
                    <td style={eyebrowStyle}>{eyebrow}</td>
                  </tr>
                </tbody>
              </table>
            ) : null}
            <Heading as="h1" style={{ ...headingStyle, textAlign: start }}>
              {heading}
            </Heading>
            {subheading ? (
              <Text style={{ ...subheadingStyle, textAlign: start }}>
                {subheading}
              </Text>
            ) : null}
            <div style={{ textAlign: start }}>{children}</div>
          </Section>
          <Section style={footerStyle}>
            <table
              role="presentation"
              align="center"
              cellPadding={0}
              cellSpacing={0}
              style={{ margin: "0 auto 14px" }}
            >
              <tbody>
                <tr>
                  {[color.rose, color.banana, color.mint, color.lavender].map(
                    (dot) => (
                      <td key={dot} style={{ padding: "0 4px" }}>
                        <div style={{ ...dotStyle, backgroundColor: dot }} />
                      </td>
                    )
                  )}
                </tr>
              </tbody>
            </table>
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
  padding: "34px 32px",
  textAlign: "center",
  // The site's "cream-rainbow" hero art (flower, crown, castle, cloud) is set
  // inline per-render (it needs the base URL). The solid cream is the
  // Outlook/Gmail fallback when the background image is dropped.
  backgroundColor: color.cream,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
}

const logoStyle: CSSProperties = {
  margin: "0 auto",
  display: "block",
  height: "auto",
}

const accentBarStyle: CSSProperties = {
  height: "6px",
  backgroundColor: color.rose,
  backgroundImage: `linear-gradient(90deg, ${color.rose} 0%, ${color.pink} 33%, ${color.lavender} 66%, ${color.mint} 100%)`,
}

const cardBodyStyle: CSSProperties = {
  padding: "28px 32px 8px",
}

const eyebrowStyle: CSSProperties = {
  borderRadius: "999px",
  backgroundColor: color.lavenderSoft,
  padding: "6px 14px",
  fontFamily: font.heading,
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.12em",
  color: color.accent,
}

const headingStyle: CSSProperties = {
  margin: "0 0 6px",
  fontFamily: font.heading,
  fontSize: "24px",
  lineHeight: "1.2",
  fontWeight: 700,
  letterSpacing: "-0.4px",
  color: color.plum,
}

const subheadingStyle: CSSProperties = {
  margin: "0 0 20px",
  fontSize: "15px",
  color: color.inkSoft,
}

const footerStyle: CSSProperties = {
  padding: "20px 32px 26px",
  textAlign: "center",
  borderTop: `1px solid ${color.border}`,
}

const dotStyle: CSSProperties = {
  width: "8px",
  height: "8px",
  borderRadius: "999px",
}

const footerTextStyle: CSSProperties = {
  margin: 0,
  fontSize: "12px",
  lineHeight: "18px",
  color: color.mutedInk,
}
