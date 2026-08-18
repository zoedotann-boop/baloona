import { NextResponse, type NextRequest } from "next/server"

import { confirmDepositPaid } from "@/lib/birthday/deposit"
import { fulfilOrder } from "@/lib/shop/orders"

/**
 * PayMe server-to-server payment notification (`sale_callback_url`).
 *
 * PayMe POSTs a form-encoded body here when a sale settles. We never trust that
 * body: it only tells us *which* order/lead to look at (via the `transaction_id`
 * we set, `order:<id>` or `lead:<id>`). The handlers below then re-query PayMe to
 * confirm the sale is really paid before issuing a card or stamping a deposit, so
 * a forged notification fulfils nothing. We always ACK 200 — PayMe retries on
 * anything else, and the work is idempotent.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const form = await request.formData()
    const [kind, id] = String(form.get("transaction_id") ?? "").split(":")
    if (id) {
      if (kind === "order") await fulfilOrder(id)
      else if (kind === "lead") await confirmDepositPaid(id)
    }
  } catch (error) {
    console.error("PayMe callback handling failed:", error)
  }
  return new NextResponse("OK")
}
