/**
 * Shared bot honeypot.
 *
 * Every public form renders a hidden field (see `HoneypotField`) that humans
 * never see or tab into. A genuine submission leaves it empty; naive spam bots
 * fill every input they find, so a non-empty value marks the request as
 * automated and the server drops it without storing anything.
 */
export const HONEYPOT_FIELD = "website"

/** True when the honeypot came back filled — i.e. the sender is a bot. */
export function isHoneypotFilled(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0
}
