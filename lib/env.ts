import "server-only"

/**
 * Server-side environment access.
 *
 * Every integration is optional: the site renders from the database alone, and
 * a missing key degrades one feature (uploads, AI translation, Google reviews,
 * outgoing mail) instead of breaking the build. Only `DATABASE_URL` and the
 * Better Auth secret are hard requirements.
 */

function required(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. See .env.example.`
    )
  }
  return value
}

function optional(name: string): string | undefined {
  return process.env[name] || undefined
}

export function databaseUrl(): string {
  return required("DATABASE_URL")
}

export const resendConfig = () => {
  const apiKey = optional("RESEND_API_KEY")
  const from = optional("RESEND_FROM_EMAIL")
  return apiKey && from ? { apiKey, from } : null
}

/**
 * Vercel Blob read-write token. Present in production once a Blob store is
 * connected to the project (Vercel injects it); locally it arrives via
 * `vercel env pull`. `handleUpload` needs this static token specifically — an
 * OIDC token cannot sign the client tokens that browser uploads use.
 */
export const blobToken = () => optional("BLOB_READ_WRITE_TOKEN")

export const geminiApiKey = () => optional("GEMINI_API_KEY")

/**
 * SerpApi key, used to read a branch's Google reviews. One key for the whole
 * brand; the per-branch Place ID lives in `site_setting`.
 */
export const serpApiKey = () => optional("SERPAPI_API_KEY")

/**
 * Shared secret for the scheduled jobs under `/api/cron`. Vercel sends it as
 * `Authorization: Bearer …` on every cron invocation. Unset means the cron
 * endpoints refuse every request rather than running unauthenticated.
 */
export const cronSecret = () => optional("CRON_SECRET")

/**
 * PayMe (PayMeService) online payments. `PAYME_SELLER_ID` is the account's
 * "Payme Id" / API key, sent in the request body — there is no separate secret.
 * Unset disables online payments: the punch-card checkout falls back to issuing
 * the card immediately. `PAYME_SANDBOX=true` targets the preprod environment for
 * testing without moving real money.
 */
export const paymeConfig = () => {
  const sellerId = optional("PAYME_SELLER_ID")
  if (!sellerId) return null
  return { sellerId, sandbox: process.env.PAYME_SANDBOX === "true" }
}
