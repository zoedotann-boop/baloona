import { redirect } from "next/navigation"

import { listManageableLocations, requireAdminUser } from "@/lib/admin/access"
import { branchHomeSection } from "@/lib/admin/permissions"

/** `/admin` has no content of its own — send the user to their first branch. */
export default async function AdminIndexPage() {
  const user = await requireAdminUser()
  const locations = await listManageableLocations(user)

  redirect(
    locations.length > 0
      ? `/admin/${locations[0].slug}/${branchHomeSection(user.role)}`
      : "/admin/locations"
  )
}
