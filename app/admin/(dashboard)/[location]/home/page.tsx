import { notFound } from "next/navigation"

import { HomeContentForm } from "@/components/admin/forms/home-content-form"
import { requireLocationAccess } from "@/lib/admin/access"
import { toLocalized, toText } from "@/lib/admin/drafts"
import { getHomeEditor } from "@/lib/db/queries/admin"

export default async function AdminHomePage({
  params,
}: PageProps<"/admin/[location]/home">) {
  const { location: slug } = await params
  const { location } = await requireLocationAccess(slug)
  const data = await getHomeEditor(location.id)
  if (!data?.home || !data.site) notFound()

  const { home, site } = data

  return (
    <HomeContentForm
      slug={slug}
      initial={{
        home: {
          heroTitle: toLocalized(home.heroTitle),
          heroDescription: toLocalized(home.heroDescription),
          heroImages: home.heroImages,
          aboutTitle: toLocalized(home.aboutTitle),
          aboutBody: toLocalized(home.aboutBody),
          aboutImageUrl: toText(home.aboutImageUrl),
          featuresCta: toLocalized(home.featuresCta),
          reassuranceTitle: toLocalized(home.reassuranceTitle),
          reassuranceBody: toLocalized(home.reassuranceBody),
          reassuranceCta: toLocalized(home.reassuranceCta),
          menuTeaserTitle: toLocalized(home.menuTeaserTitle),
          menuTeaserBody: toLocalized(home.menuTeaserBody),
          menuTeaserCta: toLocalized(home.menuTeaserCta),
          birthdayTeaserTitle: toLocalized(home.birthdayTeaserTitle),
          birthdayTeaserBody: toLocalized(home.birthdayTeaserBody),
          birthdayTeaserCta: toLocalized(home.birthdayTeaserCta),
          birthdayTeaserImageUrl: toText(home.birthdayTeaserImageUrl),
          galleryTitle: toLocalized(home.galleryTitle),
          reviewsTitle: toLocalized(home.reviewsTitle),
        },
        site: {
          footerTagline: toLocalized(site.footerTagline),
          contactTitle: toLocalized(site.contactTitle),
          contactEyebrow: toLocalized(site.contactEyebrow),
        },
        features: data.features.map((feature) => ({
          id: feature.id,
          title: toLocalized(feature.title),
          description: toLocalized(feature.description),
        })),
        teaserTiles: data.teaserTiles.map((tile) => ({
          id: tile.id,
          label: toLocalized(tile.label),
        })),
        contactSubjects: data.contactSubjects.map((subject) => ({
          id: subject.id,
          label: toLocalized(subject.label),
        })),
      }}
    />
  )
}
