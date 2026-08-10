import { TermsForm } from "@/components/admin/forms/terms-form"
import { requireLocationAccess } from "@/lib/admin/access"
import { toLocalized } from "@/lib/admin/drafts"
import { getTermsEditor } from "@/lib/db/queries/admin"

export default async function AdminTermsPage({
  params,
}: PageProps<"/admin/[location]/terms">) {
  const { location: slug } = await params
  const { location } = await requireLocationAccess(slug)
  const data = await getTermsEditor(location.id)

  return <TermsForm slug={slug} initial={{ terms: toLocalized(data?.terms) }} />
}
