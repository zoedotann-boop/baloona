import { getLocale } from "next-intl/server"

import { AdminShell } from "@/components/admin/admin-shell"
import { type Locale } from "@/i18n/routing"
import { listManageableLocations, requireAdminUser } from "@/lib/admin/access"
import { pickLocale } from "@/lib/localized"

export default async function AdminDashboardLayout({
  children,
}: LayoutProps<"/admin">) {
  const user = await requireAdminUser()
  const [locations, locale] = await Promise.all([
    listManageableLocations(user),
    getLocale() as Promise<Locale>,
  ])

  return (
    <AdminShell
      user={{ name: user.name, role: user.role }}
      locations={locations.map((location) => ({
        slug: location.slug,
        name: pickLocale(location.name, locale),
        isPublished: location.isPublished,
      }))}
    >
      {children}
    </AdminShell>
  )
}
