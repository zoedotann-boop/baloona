import { eq } from "drizzle-orm"

import { provisionLocation } from "@/lib/admin/provision"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { LOCATION_BLUEPRINTS } from "@/lib/db/seed-content"
import { locations, users } from "@/lib/db/schema"

async function seedOwner() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  const name = process.env.ADMIN_NAME || "Baloona Admin"

  if (!email || !password) {
    console.warn(
      "→ skipping owner: set ADMIN_EMAIL and ADMIN_PASSWORD (see .env.example)"
    )
    return
  }

  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  })
  if (existing) {
    console.log(`✓ owner ${email} already exists`)
    return
  }

  const ctx = await auth.$context
  const user = await ctx.internalAdapter.createUser({
    email,
    name,
    emailVerified: true,
    role: "owner",
  })
  await ctx.internalAdapter.linkAccount({
    userId: user.id,
    accountId: user.id,
    providerId: "credential",
    password: await ctx.password.hash(password),
  })

  console.log(`✓ created owner ${email}`)
}

async function seedLocations() {
  for (const blueprint of LOCATION_BLUEPRINTS) {
    const existing = await db.query.locations.findFirst({
      where: eq(locations.slug, blueprint.slug),
    })
    if (existing) {
      console.log(`✓ location /${blueprint.slug} already exists`)
      continue
    }

    await provisionLocation({
      slug: blueprint.slug,
      name: blueprint.name,
      isPublished: blueprint.isPublished,
      sortOrder: blueprint.sortOrder,
      hours: blueprint.hours,
      ...blueprint.contact,
    })
    console.log(`✓ created location /${blueprint.slug}`)
  }
}

await seedOwner()
await seedLocations()
console.log("Done.")
