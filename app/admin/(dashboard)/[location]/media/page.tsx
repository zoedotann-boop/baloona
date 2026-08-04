import { notFound } from "next/navigation"

import { MediaForm } from "@/components/admin/forms/media-form"
import { requireLocationAccess } from "@/lib/admin/access"
import { toLocalized } from "@/lib/admin/drafts"
import { getGalleryEditor } from "@/lib/db/queries/admin"

export default async function AdminMediaPage({
  params,
}: PageProps<"/admin/[location]/media">) {
  const { location: slug } = await params
  const { location } = await requireLocationAccess(slug)
  const data = await getGalleryEditor(location.id)
  if (!data) notFound()

  return (
    <MediaForm
      slug={slug}
      initial={{
        images: data.galleryImages.map((image) => ({
          id: image.id,
          url: image.url,
          alt: toLocalized(image.alt),
        })),
      }}
    />
  )
}
