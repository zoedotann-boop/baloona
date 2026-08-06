/**
 * Shared shapes + helpers for the punch-card feature.
 *
 * Kept out of the `"use server"` action module (which may only export async
 * functions) so both the server actions and the client manager can import them.
 */

/** One card as the admin manager renders it. */
interface CardView {
  id: string
  token: string
  totalPunches: number
  usedPunches: number
  status: "active" | "completed"
  issuedByLocationName: string | null
  note: string | null
}

/** A customer and their cards, shaped for the manager. */
export interface CustomerCardsView {
  id: string
  fullName: string
  phone: string
  email: string | null
  cards: CardView[]
}

/** Punches still available on a card. Never stored — always derived. */
export function remainingPunches(total: number, used: number): number {
  return Math.max(0, total - used)
}
