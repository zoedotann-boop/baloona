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
  /** When the card was created, preformatted for display (date + time). */
  createdAt: string
  /**
   * The online purchase behind this card, when it was bought through the shop.
   * `null` for a card issued at the desk. `paid` is the pay-at-branch status the
   * front desk toggles; `price` is the amount owed, preformatted with currency.
   */
  payment: { paid: boolean; price: string } | null
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
