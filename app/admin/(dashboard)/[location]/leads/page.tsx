import { getFormatter, getLocale } from "next-intl/server"

import { LeadsInbox } from "@/components/admin/leads-inbox"
import { type Locale } from "@/i18n/routing"
import { requireLocationAccess } from "@/lib/admin/access"
import { getBirthdayEditor, listLeads } from "@/lib/db/queries/admin"
import { formatPrice, pickLocale } from "@/lib/localized"

export default async function AdminLeadsPage({
  params,
}: PageProps<"/admin/[location]/leads">) {
  const { location: slug } = await params
  const { location } = await requireLocationAccess(slug)

  const [leads, editor, locale, format] = await Promise.all([
    listLeads(location.id),
    getBirthdayEditor(location.id),
    getLocale() as Promise<Locale>,
    getFormatter(),
  ])

  // Answers are stored by field key; look the current label up so the inbox
  // reads the way the form does, and fall back to the raw key for questions
  // that have since been removed.
  const labels = new Map(
    (editor?.formFields ?? []).map((field) => [
      field.key,
      pickLocale(field.label, locale),
    ])
  )

  return (
    <LeadsInbox
      slug={slug}
      leads={leads.map((lead) => ({
        id: lead.id,
        kind: lead.kind,
        status: lead.status,
        fullName: lead.fullName,
        phone: lead.phone,
        email: lead.email,
        subject: lead.subject,
        message: lead.message,
        details: Object.entries(lead.formData).map(([key, value]) => ({
          label: labels.get(key) ?? key,
          value,
        })),
        upgrades: lead.selectedUpgrades.map((upgrade) => ({
          label: upgrade.label,
          price: formatPrice(upgrade.amount, locale),
        })),
        total:
          lead.totalAmount === null
            ? null
            : formatPrice(lead.totalAmount, locale),
        signatureUrl: lead.signatureUrl,
        // Only birthday leads that reached PayMe carry a deposit state; the rest
        // stay `null` so the inbox shows no deposit row for them.
        depositPaid: lead.depositSaleId ? lead.depositPaidAt !== null : null,
        createdAt: format.dateTime(lead.createdAt, {
          dateStyle: "short",
          timeStyle: "short",
        }),
        notifyError: lead.notifyError,
      }))}
    />
  )
}
