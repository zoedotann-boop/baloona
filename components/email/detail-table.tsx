import { Section, Text } from "@react-email/components"
import type { CSSProperties } from "react"

import { emailTheme } from "./email-theme"

const { color, font } = emailTheme

export interface DetailRow {
  label: string
  value: string
}

interface DetailTableProps {
  rows: DetailRow[]
}

/**
 * The submitted details of a lead, laid out as soft rounded bands — one per
 * field — echoing the site's rounded cards. Each band stacks a muted caption
 * over the bold value, which stays readable in RTL and never truncates a long
 * message. Rows with an empty value are dropped so optional fields never render
 * as blanks. Alignment is inherited from the RTL-aware wrapper in EmailLayout.
 */
export function DetailTable({ rows }: DetailTableProps) {
  const filled = rows.filter((row) => row.value.trim())
  if (!filled.length) return null

  return (
    <Section style={tableStyle}>
      {filled.map((row, index) => (
        <div key={`${row.label}-${index}`} style={rowStyle}>
          <Text style={labelStyle}>{row.label}</Text>
          <Text style={valueStyle}>{row.value}</Text>
        </div>
      ))}
    </Section>
  )
}

const tableStyle: CSSProperties = {
  margin: "4px 0 12px",
}

const rowStyle: CSSProperties = {
  marginBottom: "8px",
  padding: "12px 16px",
  borderRadius: "16px",
  backgroundColor: color.muted,
}

const labelStyle: CSSProperties = {
  margin: "0 0 2px",
  fontFamily: font.body,
  fontSize: "12px",
  fontWeight: 600,
  letterSpacing: "0.04em",
  color: color.mutedInk,
}

const valueStyle: CSSProperties = {
  margin: 0,
  fontFamily: font.body,
  fontSize: "16px",
  fontWeight: 700,
  lineHeight: "24px",
  color: color.ink,
  wordBreak: "break-word",
}
