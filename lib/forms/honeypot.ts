export const HONEYPOT_FIELD = "contact_time"

export function isHoneypotFilled(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0
}
