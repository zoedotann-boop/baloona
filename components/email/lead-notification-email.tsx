import type { Locale } from "@/i18n/routing"

import { DetailTable, type DetailRow } from "./detail-table"
import { EmailLayout } from "./email-layout"

export interface LeadNotificationEmailProps {
  /** Locale the notification is written in (lead emails are always Hebrew). */
  locale: Locale
  /** Absolute origin the logo + background are loaded from. */
  baseUrl?: string
  /** Title of the notification, e.g. "פנייה חדשה מהאתר". */
  heading: string
  /** Inbox preview line. */
  preview: string
  /** The venue the lead came from. */
  locationName: string
  /** Shared footer copy. */
  footer: string
  /** Ordered detail rows, already labelled and localised. */
  rows: DetailRow[]
}

/**
 * New-lead notification sent to a venue's inbox (contact enquiries and birthday
 * requests both use this, differing only in `heading` and `rows`). Built on the
 * shared {@link EmailLayout} so every Baloona email reads as one design.
 */
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
