import { after, NextResponse, type NextRequest } from "next/server"
import { z } from "zod"

import { settleOrder } from "@/lib/shop/orders"

const orderTransactionId = z
  .string()
  .regex(/^order:/)
  .transform((value) => value.slice("order:".length))
  .pipe(z.uuid())

export async function POST(request: NextRequest): Promise<NextResponse> {
  const form = await request.formData().catch(() => null)
  const orderId = orderTransactionId.safeParse(form?.get("transaction_id"))
  if (orderId.success) {
    after(() =>
      settleOrder(orderId.data).catch((error) =>
        console.error("PayMe callback handling failed:", error)
      )
    )
  }
  return new NextResponse("OK")
}
