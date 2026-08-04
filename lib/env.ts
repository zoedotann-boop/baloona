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

export const r2Config = () => {
  const accountId = optional("R2_ACCOUNT_ID")
  const accessKeyId = optional("R2_ACCESS_KEY_ID")
  const secretAccessKey = optional("R2_SECRET_ACCESS_KEY")
  const bucket = optional("R2_BUCKET")
  const publicBaseUrl = optional("R2_PUBLIC_BASE_URL")
  return accountId && accessKeyId && secretAccessKey && bucket && publicBaseUrl
    ? { accountId, accessKeyId, secretAccessKey, bucket, publicBaseUrl }
    : null
}

export const geminiApiKey = () => optional("GEMINI_API_KEY")

export const googlePlacesApiKey = () => optional("GOOGLE_PLACES_API_KEY")
