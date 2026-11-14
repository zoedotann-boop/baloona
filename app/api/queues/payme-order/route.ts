import { handleCallback } from "@vercel/queue"

import {
  ORDER_RECHECK_SECONDS,
  orderCheckMessage,
} from "@/lib/shop/order-queue"
import { settleOrder } from "@/lib/shop/orders"

export const POST = handleCallback(
  async (message) => {
    const parsed = orderCheckMessage.safeParse(message)
    if (!parsed.success) return

    const settled = await settleOrder(parsed.data.orderId)
    if (settled?.status === "pending") {
      throw new Error(`PayMe order ${parsed.data.orderId} is still pending`)
    }
  },
  { retry: () => ({ afterSeconds: ORDER_RECHECK_SECONDS }) }
)
