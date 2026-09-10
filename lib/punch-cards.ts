import { type PunchCardTheme } from "@/lib/db/schema/punch-cards"

interface PunchView {
  id: string
  at: string
  branchName: string | null
}

interface CardView {
  id: string
  token: string
  totalPunches: number
  usedPunches: number
  status: "active" | "completed"
  theme: PunchCardTheme
  issuedByLocationName: string | null
  invoiceNumber: string | null
  note: string | null
  createdAt: string
  punches: PunchView[]
  payment: { paid: boolean; price: string } | null
}

export interface CustomerCardsView {
  id: string
  fullName: string
  phone: string
  email: string | null
  cards: CardView[]
}

export const PUNCH_CARDS_PAGE_SIZE = 20

export interface PunchCardsPage {
  customers: CustomerCardsView[]
  hasMore: boolean
}

export function remainingPunches(total: number, used: number): number {
  return Math.max(0, total - used)
}
