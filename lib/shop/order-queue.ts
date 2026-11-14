import "server-only"

import { send } from "@vercel/queue"
import { z } from "zod"

const ORDER_CHECK_TOPIC = "payme-order"

export const ORDER_RECHECK_SECONDS = 30 * 60

const FIRST_CHECK_DELAY_SECONDS = 15 * 60
const MESSAGE_RETENTION_SECONDS = 2 * 24 * 60 * 60

export const orderCheckMessage = z.object({ orderId: z.uuid() })

export async function scheduleOrderCheck(orderId: string): Promise<void> {
  try {
    await send(
      ORDER_CHECK_TOPIC,
      { orderId } satisfies z.infer<typeof orderCheckMessage>,
      {
        delaySeconds: FIRST_CHECK_DELAY_SECONDS,
        retentionSeconds: MESSAGE_RETENTION_SECONDS,
        idempotencyKey: orderId,
      }
    )
  } catch (error) {
    console.error("scheduling the PayMe order check failed:", error)
  }
}
