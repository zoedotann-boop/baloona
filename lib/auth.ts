import { drizzleAdapter } from "@better-auth/drizzle-adapter"
import { betterAuth } from "better-auth"
import { nextCookies } from "better-auth/next-js"

import { db } from "@/lib/db"
import { accounts, sessions, users, verifications } from "@/lib/db/schema"

export const auth = betterAuth({
  appName: "Baloona",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
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
        type: ["owner", "manager", "staff"],
        defaultValue: "manager",
        input: false,
      },
    },
  },
  plugins: [nextCookies()],
})
