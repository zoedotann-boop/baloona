import { redirect } from "next/navigation"

import { listManageableLocations, requireAdminUser } from "@/lib/admin/access"

/** `/admin` has no content of its own — send the user to their first branch. */
export default async function AdminIndexPage() {
  const user = await requireAdminUser()
  const locations = await listManageableLocations(user)

  redirect(
    locations.length > 0
      ? `/admin/${locations[0].slug}/general`
      : "/admin/locations"
  )
}
