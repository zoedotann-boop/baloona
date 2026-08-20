import { notFound } from "next/navigation"

import { ReviewsForm } from "@/components/admin/forms/reviews-form"
import { requireLocationAccess } from "@/lib/admin/access"
import { toReviewDraft } from "@/lib/admin/drafts"
import { getReviewsEditor } from "@/lib/db/queries/admin"

export default async function AdminReviewsPage({
  params,
}: PageProps<"/admin/[location]/reviews">) {
  const { location: slug } = await params
  const { location } = await requireLocationAccess(slug)
  const data = await getReviewsEditor(location.id)
  if (!data) notFound()

  return (
    <ReviewsForm
      slug={slug}
      hasPlaceId={Boolean(data.settings?.googlePlaceId)}
      initial={{
        autoSync: data.settings?.googleReviewsAutoSync ?? false,
        reviews: data.reviews.map(toReviewDraft),
      }}
    />
  )
}
