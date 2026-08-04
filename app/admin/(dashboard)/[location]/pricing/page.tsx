import { notFound } from "next/navigation"

import { PricingForm } from "@/components/admin/forms/pricing-form"
import { requireLocationAccess } from "@/lib/admin/access"
import { toLocalized, toLocalizedList } from "@/lib/admin/drafts"
import { getPricingEditor } from "@/lib/db/queries/admin"

export default async function AdminPricingPage({
  params,
}: PageProps<"/admin/[location]/pricing">) {
  const { location: slug } = await params
  const { location } = await requireLocationAccess(slug)
  const data = await getPricingEditor(location.id)
  if (!data?.pricing) notFound()

  return (
    <PricingForm
      slug={slug}
      initial={{
        title: toLocalized(data.pricing.title),
        note: toLocalized(data.pricing.note),
        rules: toLocalizedList(data.pricing.rules),
        tiers: data.priceTiers.map((tier) => ({
          id: tier.id,
          title: toLocalized(tier.title),
          subtitle: toLocalized(tier.subtitle),
          isFeatured: tier.isFeatured,
          rows: tier.rows.map((row) => ({
            id: row.id,
            label: toLocalized(row.label),
            amount: row.amount,
          })),
        })),
      }}
    />
  )
}
