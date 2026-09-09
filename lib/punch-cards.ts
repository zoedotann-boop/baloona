import { type PunchCardTheme } from "@/lib/db/schema/punch-cards"

interface CardView {
  id: string
  token: string
  totalPunches: number
  usedPunches: number
  status: "active" | "completed"
  theme: PunchCardTheme
  issuedByLocationName: string | null
  note: string | null
  createdAt: string
  payment: { paid: boolean; price: string } | null
}

export interface CustomerCardsView {
  id: string
  fullName: string
  phone: string
  email: string | null
  cards: CardView[]
}

export function remainingPunches(total: number, used: number): number {
  return Math.max(0, total - used)
}
