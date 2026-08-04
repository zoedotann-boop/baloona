import { getLocale } from "next-intl/server"

import { TeamManager } from "@/components/admin/team-manager"
import { type Locale } from "@/i18n/routing"
import { requireOwnerAccess } from "@/lib/admin/access"
import { listAllLocations, listTeam } from "@/lib/db/queries/admin"
import { pickLocale } from "@/lib/localized"

export default async function AdminTeamPage() {
  const owner = await requireOwnerAccess()
  const [members, locations, locale] = await Promise.all([
    listTeam(),
    listAllLocations(),
    getLocale() as Promise<Locale>,
  ])

  return (
    <TeamManager
      locations={locations.map((location) => ({
        id: location.id,
        name: pickLocale(location.name, locale),
      }))}
      members={members.map((member) => ({
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        locationIds: member.memberships.map(
          (membership) => membership.locationId
        ),
        isSelf: member.id === owner.id,
      }))}
    />
  )
}
