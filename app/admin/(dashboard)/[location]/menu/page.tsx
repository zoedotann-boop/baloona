import { notFound } from "next/navigation"

import { MenuForm } from "@/components/admin/forms/menu-form"
import { requireLocationAccess } from "@/lib/admin/access"
import { toLocalized } from "@/lib/admin/drafts"
import { getMenuEditor } from "@/lib/db/queries/admin"

export default async function AdminMenuPage({
  params,
}: PageProps<"/admin/[location]/menu">) {
  const { location: slug } = await params
  const { location } = await requireLocationAccess(slug)
  const data = await getMenuEditor(location.id)
  if (!data?.menu) notFound()

  return (
    <MenuForm
      slug={slug}
      initial={{
        title: toLocalized(data.menu.title),
        description: toLocalized(data.menu.description),
        note: toLocalized(data.menu.note),
        categories: data.menuCategories.map((category) => ({
          id: category.id,
          label: toLocalized(category.label),
          isVisible: category.isVisible,
          items: category.items.map((item) => ({
            id: item.id,
            name: toLocalized(item.name),
            description: toLocalized(item.description),
            amount: item.amount,
            isVisible: item.isVisible,
          })),
        })),
      }}
    />
  )
}
