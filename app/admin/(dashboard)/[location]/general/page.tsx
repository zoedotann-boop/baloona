import { notFound } from "next/navigation"

import { GeneralSettingsForm } from "@/components/admin/forms/general-settings-form"
import { requireLocationAccess } from "@/lib/admin/access"
import { toLocalized, toLocalizedList, toText } from "@/lib/admin/drafts"
import { getGeneralSettings } from "@/lib/db/queries/admin"
import type { SeoPage } from "@/lib/db/schema"

const SEO_PAGES: SeoPage[] = ["home", "menu", "birthdays"]

export default async function GeneralSettingsPage({
  params,
}: PageProps<"/admin/[location]/general">) {
  const { location: slug } = await params
  const { location } = await requireLocationAccess(slug)
  const data = await getGeneralSettings(location.id)
  if (!data) notFound()

  return (
    <GeneralSettingsForm
      slug={slug}
      initial={{
        contact: {
          city: toLocalized(data.contact?.city),
          address: toLocalized(data.contact?.address),
          phone: toText(data.contact?.phone),
          whatsapp: toText(data.contact?.whatsapp),
          email: toText(data.contact?.email),
          leadRecipientEmail: toText(data.contact?.leadRecipientEmail),
          instagramUrl: toText(data.contact?.instagramUrl),
          facebookUrl: toText(data.contact?.facebookUrl),
          tiktokUrl: toText(data.contact?.tiktokUrl),
        },
        hours: data.openingHours.map((day) => ({
          weekday: day.weekday,
          opensAt: day.opensAt,
          closesAt: day.closesAt,
          isClosed: day.isClosed,
        })),
        announcement: {
          isActive: data.announcement?.isActive ?? false,
          title: toLocalized(data.announcement?.title),
          body: toLocalized(data.announcement?.body),
          lines: toLocalizedList(data.announcement?.lines),
          ctaLabel: toLocalized(data.announcement?.ctaLabel),
          ctaHref: toText(data.announcement?.ctaHref),
          bumpVersion: false,
        },
        seo: {
          pages: SEO_PAGES.map((page) => {
            const entry = data.seoEntries.find((row) => row.page === page)
            return {
              page,
              title: toLocalized(entry?.title),
              description: toLocalized(entry?.description),
              keywords: toLocalized(entry?.keywords),
            }
          }),
          googlePlaceId: toText(data.settings?.googlePlaceId),
          gaMeasurementId: toText(data.settings?.gaMeasurementId),
          metaPixelId: toText(data.settings?.metaPixelId),
          gtmContainerId: toText(data.settings?.gtmContainerId),
          faviconUrl: toText(data.settings?.faviconUrl),
          ogImageUrl: toText(data.settings?.ogImageUrl),
        },
      }}
    />
  )
}
