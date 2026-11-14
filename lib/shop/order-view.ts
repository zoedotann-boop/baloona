import type { ShopOrderStatus } from "@/lib/db/schema/shop"

export interface OrderView {
  id: string
  status: ShopOrderStatus
  createdAt: string
  paidAt: string | null
  refundedAt: string | null
  fullName: string
  phone: string
  email: string
  customerEmail: string | null
  productName: string
  entries: number
  amount: string
  branchName: string | null
  saleId: string | null
  cardPath: string | null
  canRecheck: boolean
  canRefund: boolean
  cardUsed: boolean
}
