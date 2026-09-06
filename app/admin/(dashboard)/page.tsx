import { redirect } from "next/navigation"

import { listManageableLocations, requireAdminUser } from "@/lib/admin/access"
import { branchHomeSection } from "@/lib/admin/permissions"

export default async function AdminIndexPage() {
  const user = await requireAdminUser()
  const locations = await listManageableLocations(user)

  redirect(
    locations.length > 0
      ? `/admin/${locations[0].slug}/${branchHomeSection(user.role)}`
      : "/admin/locations"
  )
}
