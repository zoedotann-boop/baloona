import "server-only"

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

export function emailAssetsBaseUrl(): string {
  const base = optional("EMAIL_ASSETS_BASE_URL") || "https://baloona.co.il"
  return base.replace(/\/+$/, "")
}

export const blobToken = () => optional("BLOB_READ_WRITE_TOKEN")

export const geminiApiKey = () => optional("GEMINI_API_KEY")

export const serpApiKey = () => optional("SERPAPI_API_KEY")

export const cronSecret = () => optional("CRON_SECRET")

export const paymeConfig = () => {
  const sellerId = optional("PAYME_SELLER_ID")
  if (!sellerId) return null
  return { sellerId, sandbox: process.env.PAYME_SANDBOX === "true" }
}
