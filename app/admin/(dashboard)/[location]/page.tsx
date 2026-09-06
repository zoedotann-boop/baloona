import { redirect } from "next/navigation"

export default async function AdminLocationIndex({
  params,
}: PageProps<"/admin/[location]">) {
  const { location } = await params
  redirect(`/admin/${location}/general`)
}
