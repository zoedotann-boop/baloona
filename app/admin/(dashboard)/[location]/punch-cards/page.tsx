import { PunchCardsManager } from "@/components/admin/punch-cards-manager"
import { searchPunchCards } from "@/lib/actions/admin/punch-cards"
import { requireLocationAccess } from "@/lib/admin/access"

export default async function AdminPunchCardsPage({
  params,
}: PageProps<"/admin/[location]/punch-cards">) {
  const { location: slug } = await params
  await requireLocationAccess(slug)

  // Blank query = the most recent customers, so the console opens with context.
  const initial = await searchPunchCards({ slug })

  return <PunchCardsManager slug={slug} initial={initial} />
}
