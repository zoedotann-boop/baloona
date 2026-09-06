import { NextResponse, type NextRequest } from "next/server"

import { fulfilOrder } from "@/lib/shop/orders"

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const form = await request.formData()
    const [kind, id] = String(form.get("transaction_id") ?? "").split(":")
    if (kind === "order" && id) await fulfilOrder(id)
  } catch (error) {
    console.error("PayMe callback handling failed:", error)
  }
  return new NextResponse("OK")
}
