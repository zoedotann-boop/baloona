"use server"

import { redirect } from "next/navigation"
import { count, eq } from "drizzle-orm"
import { z } from "zod"

import { requireLocationAccess, requireOwnerAccess } from "@/lib/admin/access"
import { provisionLocation } from "@/lib/admin/provision"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { locationMembers, locations, users } from "@/lib/db/schema"

import { localizedSchema, OK, type ActionResult } from "./shared"

/** Owner-only: opening, renaming and staffing branches. */

const slugSchema = z
  .string()
  .trim()
  .min(2)
  .max(60)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "lowercase letters, digits and dashes")

const createSchema = z.object({
  slug: slugSchema,
  name: localizedSchema,
  city: localizedSchema,
  address: localizedSchema,
  phone: z.string().trim().max(40),
  whatsapp: z.string().trim().max(20),
  email: z.union([z.email(), z.literal("")]),
})

export async function createLocation(
  input: z.input<typeof createSchema>
): Promise<ActionResult> {
  await requireOwnerAccess()

  const parsed = createSchema.safeParse(input)
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0].message }
  const data = parsed.data

  const clash = await db.query.locations.findFirst({
    where: eq(locations.slug, data.slug),
  })
  if (clash) return { ok: false, error: "slug-taken" }

  // New branches go last in the chooser and start unpublished.
  const [{ value: existingCount }] = await db
    .select({ value: count() })
    .from(locations)

  await provisionLocation({
    ...data,
    leadRecipientEmail: data.email,
    isPublished: false,
    sortOrder: existingCount,
  })

  redirect(`/admin/${data.slug}/general`)
}

const updateSchema = z.object({
  slug: z.string().min(1),
  name: localizedSchema,
  isPublished: z.boolean(),
  sortOrder: z.number().int().min(0),
})

export async function updateLocation(
  input: z.input<typeof updateSchema>
): Promise<ActionResult> {
  const { location } = await requireLocationAccess(input.slug)

  const parsed = updateSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }
  const { slug: _slug, ...values } = parsed.data

  await db.update(locations).set(values).where(eq(locations.id, location.id))
  return OK
}

export async function deleteLocation(slug: string): Promise<ActionResult> {
  await requireOwnerAccess()
  const location = await db.query.locations.findFirst({
    where: eq(locations.slug, slug),
  })
  if (!location) return { ok: false, error: "not-found" }

  // Every content table cascades from the location row.
  await db.delete(locations).where(eq(locations.id, location.id))
  redirect("/admin/locations")
}

// --- ניהול צוות -------------------------------------------------------------

const memberSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.email(),
  password: z.string().min(8).max(200),
  role: z.enum(["owner", "manager"]),
  locationIds: z.array(z.uuid()),
})

/**
 * Create a teammate.
 *
 * Public sign-up is off, so accounts are minted here through Better Auth's
 * internal adapter — the same path the seed script uses — and the owner hands
 * over the first password.
 */
export async function createTeamMember(
  input: z.input<typeof memberSchema>
): Promise<ActionResult> {
  await requireOwnerAccess()

  const parsed = memberSchema.safeParse(input)
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0].message }
  const data = parsed.data

  const clash = await db.query.users.findFirst({
    where: eq(users.email, data.email),
  })
  if (clash) return { ok: false, error: "email-taken" }

  const ctx = await auth.$context
  const user = await ctx.internalAdapter.createUser({
    email: data.email,
    name: data.name,
    emailVerified: true,
    role: data.role,
  })
  await ctx.internalAdapter.linkAccount({
    userId: user.id,
    accountId: user.id,
    providerId: "credential",
    password: await ctx.password.hash(data.password),
  })

  if (data.role === "manager" && data.locationIds.length > 0) {
    await db
      .insert(locationMembers)
      .values(
        data.locationIds.map((locationId) => ({ userId: user.id, locationId }))
      )
  }

  return OK
}

const assignmentSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["owner", "manager"]),
  locationIds: z.array(z.uuid()),
})

export async function updateTeamMember(
  input: z.input<typeof assignmentSchema>
): Promise<ActionResult> {
  const owner = await requireOwnerAccess()

  const parsed = assignmentSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }
  const data = parsed.data

  // An owner demoting themselves would lock the last owner out of the admin.
  if (data.userId === owner.id && data.role !== "owner")
    return { ok: false, error: "cannot-demote-self" }

  await db
    .update(users)
    .set({ role: data.role })
    .where(eq(users.id, data.userId))
  await db
    .delete(locationMembers)
    .where(eq(locationMembers.userId, data.userId))

  if (data.role === "manager" && data.locationIds.length > 0) {
    await db.insert(locationMembers).values(
      data.locationIds.map((locationId) => ({
        userId: data.userId,
        locationId,
      }))
    )
  }

  return OK
}

export async function deleteTeamMember(userId: string): Promise<ActionResult> {
  const owner = await requireOwnerAccess()
  if (userId === owner.id) return { ok: false, error: "cannot-delete-self" }

  await db.delete(users).where(eq(users.id, userId))
  return OK
}
