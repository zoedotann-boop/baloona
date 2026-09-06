import { z } from "zod"

const NAME_MAX = 120
const PHONE_MAX = 40
const EMAIL_MAX = 200

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
  from: z.string().optional(),
  honeypot,
})
