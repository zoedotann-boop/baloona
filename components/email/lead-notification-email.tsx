import type { Locale } from "@/i18n/routing"

import { DetailTable, type DetailRow } from "./detail-table"
import { EmailLayout } from "./email-layout"

export interface LeadNotificationEmailProps {
  locale: Locale
  baseUrl?: string
  heading: string
  preview: string
  locationName: string
  footer: string
  rows: DetailRow[]
}

export function LeadNotificationEmail({
  locale,
  baseUrl,
  heading,
  preview,
  locationName,
  footer,
  rows,
}: LeadNotificationEmailProps) {
  return (
    <EmailLayout
      locale={locale}
      baseUrl={baseUrl}
      preview={preview}
      heading={heading}
      subheading={locationName}
      footer={footer}
    >
      <DetailTable rows={rows} />
    </EmailLayout>
  )
}
