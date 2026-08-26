import { Column, Row, Section, Text } from "@react-email/components"
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
 * A label/value list for email bodies — the reusable way any Baloona template
 * lays out submitted details. Rows with an empty value are dropped so optional
 * fields never render as blanks.
 */
export function DetailTable({ rows }: DetailTableProps) {
  const filled = rows.filter((row) => row.value.trim())
  if (!filled.length) return null

  return (
    <Section style={tableStyle}>
      {filled.map((row, index) => (
        <Row key={`${row.label}-${index}`} style={rowStyle}>
          <Column style={labelStyle}>{row.label}</Column>
          <Column style={valueColumnStyle}>
            <Text style={valueStyle}>{row.value}</Text>
          </Column>
        </Row>
      ))}
    </Section>
  )
}

const tableStyle: CSSProperties = {
  marginBottom: "12px",
}

const rowStyle: CSSProperties = {
  borderBottom: `1px solid ${color.muted}`,
}

const labelStyle: CSSProperties = {
  padding: "10px 0",
  width: "34%",
  verticalAlign: "top",
  fontSize: "13px",
  color: color.mutedInk,
  whiteSpace: "nowrap",
}

const valueColumnStyle: CSSProperties = {
  padding: "10px 0",
  verticalAlign: "top",
}

const valueStyle: CSSProperties = {
  margin: 0,
  fontFamily: font.body,
  fontSize: "15px",
  fontWeight: 600,
  color: color.ink,
  wordBreak: "break-word",
}
