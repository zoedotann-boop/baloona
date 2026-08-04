import { getLocale } from "next-intl/server"

import { LocationsManager } from "@/components/admin/locations-manager"
import { type Locale } from "@/i18n/routing"
import { requireOwnerAccess } from "@/lib/admin/access"
import { toLocalized } from "@/lib/admin/drafts"
import { listAllLocations } from "@/lib/db/queries/admin"
import { pickLocale } from "@/lib/localized"

export default async function AdminLocationsPage() {
  await requireOwnerAccess()
  const [locations, locale] = await Promise.all([
    listAllLocations(),
    getLocale() as Promise<Locale>,
  ])

  return (
    <LocationsManager
      locations={locations.map((location) => ({
        slug: location.slug,
        name: toLocalized(location.name),
        isPublished: location.isPublished,
        sortOrder: location.sortOrder,
        city: pickLocale(location.contact?.city, locale),
        address: pickLocale(location.contact?.address, locale),
      }))}
    />
  )
}
