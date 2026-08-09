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

export const googlePlacesApiKey = () => optional("GOOGLE_PLACES_API_KEY")
