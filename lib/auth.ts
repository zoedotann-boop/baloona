import { drizzleAdapter } from "@better-auth/drizzle-adapter"
import { betterAuth } from "better-auth"
import { nextCookies } from "better-auth/next-js"

import { db } from "@/lib/db"
import { accounts, sessions, users, verifications } from "@/lib/db/schema"

/**
 * Admin authentication.
 *
 * Sign-up is closed: the first owner comes from `bun run db:seed` and every
 * other account is created by an owner in ניהול צוות. That keeps the admin a
 * private back office without an invite-token flow to maintain.
 */
export const auth = betterAuth({
  appName: "Baloona",
  database: drizzleAdapter(db, {
    provider: "pg",
    // Better Auth addresses models by its own singular names; the schema uses
    // plural table exports, so map them explicitly.
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
    // The Neon HTTP driver has no interactive transactions.
    transaction: false,
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 8,
  },
  user: {
    additionalFields: {
      role: {
        type: ["owner", "manager"],
        defaultValue: "manager",
        // Assigned by owners through the admin UI, never by the client.
        input: false,
      },
    },
  },
  // `nextCookies` must stay last so it can flush Set-Cookie after other plugins.
  plugins: [nextCookies()],
})
