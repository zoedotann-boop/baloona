import { drizzleAdapter } from "@better-auth/drizzle-adapter"
import { betterAuth } from "better-auth"
import { nextCookies } from "better-auth/next-js"
import { emailOTP } from "better-auth/plugins"

import { db } from "@/lib/db"
import { accounts, sessions, users, verifications } from "@/lib/db/schema"
import { sendLoginOtp } from "@/lib/email/login-otp"

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
  user: {
    additionalFields: {
      role: {
        type: ["owner", "manager", "staff"],
        defaultValue: "manager",
        input: false,
      },
    },
  },
  plugins: [
    emailOTP({
      disableSignUp: true,
      async sendVerificationOTP({ email, otp }) {
        await sendLoginOtp({ to: email, otp })
      },
    }),
    nextCookies(),
  ],
})
