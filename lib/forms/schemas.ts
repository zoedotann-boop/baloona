import { z } from "zod"

/**
 * Validation schemas shared by the public forms and the server actions behind
 * them, so the client and the server enforce exactly the same rules. Each
 * payload also carries an optional `honeypot` field (see `lib/forms/honeypot`)
 * that the action drops when filled.
 */

const NAME_MAX = 120
const PHONE_MAX = 40
const EMAIL_MAX = 200

/** Permissive phone: 6+ characters of digits, spaces or dashes, optional `+`. */
const phone = z
  .string()
  .trim()
  .min(6)
  .max(PHONE_MAX)
  .regex(/^\+?[\d\s-]+$/)

const honeypot = z.string().optional()

export const contactLeadSchema = z.object({
  locationId: z.uuid(),
  fullName: z.string().trim().min(1).max(NAME_MAX),
  phone,
  subject: z.string().trim().max(120).optional(),
  message: z.string().trim().min(1).max(4000),
  honeypot,
})

export const checkoutSchema = z.object({
  productId: z.uuid(),
  fullName: z.string().trim().min(1).max(NAME_MAX),
  phone,
  email: z.email().max(EMAIL_MAX),
  /** Branch the visitor bought from, recorded as the issuing branch. */
  from: z.string().optional(),
  honeypot,
})
