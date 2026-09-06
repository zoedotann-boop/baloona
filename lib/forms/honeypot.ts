/**
 * Shared bot honeypot.
 *
 * Every public form renders a hidden field (see `HoneypotField`) that humans
 * never see or tab into. A genuine submission leaves it empty; naive spam bots
 * fill every input they find, so a non-empty value marks the request as
 * automated and the server drops it without storing anything.
 *
 * The name is deliberately neutral (not "website"/"url"/"email"/etc.): browser
 * autofill and password managers fill fields whose names match known tokens, and
 * a "website"-named field gets auto-filled with a saved URL — which then reads as
 * a bot and silently rejects a real person's submission. A non-standard name
 * keeps naive bots (which fill everything) caught while humans stay clear.
 */
export const HONEYPOT_FIELD = "contact_time"

/** True when the honeypot came back filled — i.e. the sender is a bot. */
export function isHoneypotFilled(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0
}
