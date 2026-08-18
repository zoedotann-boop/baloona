import { redirect } from "next/navigation"
import { getLocale } from "next-intl/server"

import { BrandShell } from "@/components/layout/brand-shell"
import { LocationChooser } from "@/components/locations/location-chooser"
import { listPublishedLocations } from "@/lib/db/queries/site"
import { pickLocale } from "@/lib/localized"

/**
 * Branch picker. With a single published branch there is nothing to choose, so
 * visitors go straight there.
 */
export default async function Page() {
  const [locale, locations] = await Promise.all([
    getLocale(),
    listPublishedLocations(),
  ])

  if (locations.length === 1) redirect(`/${locations[0].slug}`)

  return (
    <BrandShell>
      <LocationChooser
        locations={locations.map((location) => ({
          slug: location.slug,
          name: pickLocale(location.name, locale),
          city: pickLocale(location.contact?.city, locale),
          address: pickLocale(location.contact?.address, locale),
          description: pickLocale(location.home?.heroDescription, locale),
          imageUrl: location.home?.heroImages?.[0],
        }))}
      />
    </BrandShell>
  )
}
