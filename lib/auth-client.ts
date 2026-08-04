import { inferAdditionalFields } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

import type { auth } from "@/lib/auth"

/** Browser-side auth client — used by the admin login form and sign-out. */
export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
})
