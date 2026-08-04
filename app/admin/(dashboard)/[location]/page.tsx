import { redirect } from "next/navigation"

/** `/admin/<slug>` opens on the branch's general settings. */
export default async function AdminLocationIndex({
  params,
}: PageProps<"/admin/[location]">) {
  const { location } = await params
  redirect(`/admin/${location}/general`)
}
