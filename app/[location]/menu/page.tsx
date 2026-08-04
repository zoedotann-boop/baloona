import { notFound } from "next/navigation"
import { getLocale } from "next-intl/server"

import { MenuBoard } from "@/components/menu/menu-board"
import { type Locale } from "@/i18n/routing"
import { getMenuPage } from "@/lib/db/queries/site"
import { formatPrice, pickLocale } from "@/lib/localized"
import { buildPageMetadata } from "@/lib/seo"

export async function generateMetadata({
  params,
}: PageProps<"/[location]/menu">) {
  const { location } = await params
  return buildPageMetadata(location, "menu")
}

export default async function MenuPage({
  params,
}: PageProps<"/[location]/menu">) {
  const { location: slug } = await params
  const [data, locale] = await Promise.all([
    getMenuPage(slug),
    getLocale() as Promise<Locale>,
  ])

  if (!data?.menu) notFound()

  return (
    <MenuBoard
      title={pickLocale(data.menu.title, locale)}
      description={pickLocale(data.menu.description, locale)}
      note={pickLocale(data.menu.note, locale)}
      categories={data.menuCategories.map((category) => ({
        id: category.id,
        label: pickLocale(category.label, locale),
        items: category.items.map((item) => ({
          id: item.id,
          name: pickLocale(item.name, locale),
          description: pickLocale(item.description, locale),
          price: formatPrice(item.amount, locale),
        })),
      }))}
    />
  )
}
