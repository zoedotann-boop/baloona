import "server-only"

import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { and, asc, eq } from "drizzle-orm"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { locationMembers, locations, type UserRole } from "@/lib/db/schema"

import { can, type AdminCapability } from "./permissions"
import { ADMIN_LOGIN_PATH } from "./routes"

export interface AdminUser {
  id: string
  name: string
  email: string
  role: UserRole
}

export async function getAdminUser(): Promise<AdminUser | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return null
  const { id, name, email, role } = session.user
  return { id, name, email, role: role as UserRole }
}

export async function requireAdminUser(): Promise<AdminUser> {
  const user = await getAdminUser()
  if (!user) redirect(ADMIN_LOGIN_PATH)
  return user
}

export async function requireOwnerAccess(): Promise<AdminUser> {
  const user = await requireAdminUser()
  if (user.role !== "owner") notFound()
  return user
}

export type ManageableLocation = Pick<
  typeof locations.$inferSelect,
  "id" | "slug" | "name" | "isPublished"
>

export async function listManageableLocations(
  user: AdminUser
): Promise<ManageableLocation[]> {
  const columns = {
    id: locations.id,
    slug: locations.slug,
    name: locations.name,
    isPublished: locations.isPublished,
  }

  if (user.role === "owner") {
    return db
      .select(columns)
      .from(locations)
      .orderBy(asc(locations.sortOrder), asc(locations.slug))
  }

  return db
    .select(columns)
    .from(locations)
    .innerJoin(
      locationMembers,
      and(
        eq(locationMembers.locationId, locations.id),
        eq(locationMembers.userId, user.id)
      )
    )
    .orderBy(asc(locations.sortOrder), asc(locations.slug))
}

export async function requireLocationAccess(
  slug: unknown,
  capability?: AdminCapability
): Promise<{
  user: AdminUser
  location: typeof locations.$inferSelect
}> {
  const user = await requireAdminUser()

  if (capability && !can(user.role, capability)) notFound()

  const location = await db.query.locations.findFirst({
    where: eq(locations.slug, String(slug)),
  })
  if (!location) notFound()

  if (user.role !== "owner") {
    const membership = await db.query.locationMembers.findFirst({
      where: and(
        eq(locationMembers.userId, user.id),
        eq(locationMembers.locationId, location.id)
      ),
    })
    if (!membership) notFound()
  }

  return { user, location }
}
