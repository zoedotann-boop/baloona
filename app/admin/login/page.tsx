import { redirect } from "next/navigation"

import { AdminLoginForm } from "@/components/admin/admin-login-form"
import { getAdminUser } from "@/lib/admin/access"

export const metadata = { title: "Baloona admin" }

export default async function AdminLoginPage() {
  if (await getAdminUser()) redirect("/admin")
  return <AdminLoginForm />
}
