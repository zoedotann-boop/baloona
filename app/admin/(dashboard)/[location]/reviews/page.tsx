import { notFound } from "next/navigation"

import { ReviewsForm } from "@/components/admin/forms/reviews-form"
import { requireLocationAccess } from "@/lib/admin/access"
import { toLocalized } from "@/lib/admin/drafts"
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
        reviews: data.reviews.map((review) => ({
          id: review.id,
          authorName: review.authorName,
          rating: review.rating,
          text: toLocalized(review.text),
          isPublished: review.isPublished,
          publishedAt: review.publishedAt.toISOString().slice(0, 10),
          source: review.source,
        })),
      }}
    />
  )
}
