import "server-only"

import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { and, asc, eq } from "drizzle-orm"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { locationMembers, locations, type UserRole } from "@/lib/db/schema"

import { ADMIN_LOGIN_PATH } from "./routes"

export interface AdminUser {
  id: string
  name: string
  email: string
  role: UserRole
}

/** The signed-in admin, or `null` for anonymous requests. */
export async function getAdminUser(): Promise<AdminUser | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return null
  const { id, name, email, role } = session.user
  return { id, name, email, role: role as UserRole }
}

/** The signed-in admin, redirecting anonymous visitors to the login page. */
export async function requireAdminUser(): Promise<AdminUser> {
  const user = await getAdminUser()
  if (!user) redirect(ADMIN_LOGIN_PATH)
  return user
}

/** Owner-only areas (locations, team). Managers get a 404 rather than a hint. */
export async function requireOwnerAccess(): Promise<AdminUser> {
  const user = await requireAdminUser()
  if (user.role !== "owner") notFound()
  return user
}

export type ManageableLocation = Pick<
  typeof locations.$inferSelect,
  "id" | "slug" | "name" | "isPublished"
>

/** Locations this admin may edit — all of them for owners. */
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

/**
 * Resolve a location slug to a branch the caller may edit.
 *
 * This is the authorization gate for every admin route and every admin server
 * action, and actions call it before doing any other work. Unknown slugs and
 * branches the caller has no membership for both 404, so the admin never
 * reveals which branches exist.
 */
export async function requireLocationAccess(slug: unknown): Promise<{
  user: AdminUser
  location: typeof locations.$inferSelect
}> {
  const user = await requireAdminUser()

  // Server actions call this with unvalidated input, so coerce here rather than
  // trusting every call site to have parsed first.
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
