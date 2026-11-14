import { describe, expect, test } from "bun:test"

import {
  nextOrderStep,
  ORDER_TTL_MS,
  refundBlocker,
  shouldQueryPayMe,
} from "@/lib/shop/order-lifecycle"

const createdAt = new Date("2026-11-14T10:00:00Z")
const soon = new Date(createdAt.getTime() + 60_000)
const later = new Date(createdAt.getTime() + ORDER_TTL_MS + 1)

const pending = { status: "pending" as const, amount: 120, createdAt }

describe("nextOrderStep", () => {
  test("issues the card once PayMe confirms the full amount", () => {
    expect(
      nextOrderStep(pending, { status: "completed", amount: 120 }, soon)
    ).toBe("issue")
  })

  test("never issues a card when the paid amount differs", () => {
    expect(
      nextOrderStep(pending, { status: "completed", amount: 1 }, soon)
    ).toBe("none")
  })

  test("still issues a card for a payment that lands after expiry", () => {
    expect(
      nextOrderStep(
        { ...pending, status: "expired" },
        { status: "completed", amount: 120 },
        later
      )
    ).toBe("issue")
  })

  test("does not issue twice for an order that is already paid", () => {
    expect(
      nextOrderStep(
        { ...pending, status: "paid" },
        { status: "completed", amount: 120 },
        soon
      )
    ).toBe("none")
  })

  test("waits while the sale is unpaid and young", () => {
    expect(
      nextOrderStep(pending, { status: "initial", amount: 120 }, soon)
    ).toBe("none")
    expect(nextOrderStep(pending, null, soon)).toBe("none")
  })

  test("expires an unpaid order after the sale link has lapsed", () => {
    expect(nextOrderStep(pending, null, later)).toBe("expire")
    expect(
      nextOrderStep(pending, { status: "failed", amount: 120 }, later)
    ).toBe("expire")
  })

  test("mirrors a refund made in the Paid dashboard", () => {
    expect(
      nextOrderStep(
        { ...pending, status: "paid" },
        { status: "refunded", amount: 120 },
        soon
      )
    ).toBe("refund")
  })

  test("leaves refunded and failed orders alone", () => {
    for (const status of ["refunded", "failed"] as const) {
      expect(
        nextOrderStep(
          { ...pending, status },
          { status: "refunded", amount: 120 },
          later
        )
      ).toBe("none")
    }
  })
})

describe("shouldQueryPayMe", () => {
  test("only open or paid orders need PayMe", () => {
    expect(shouldQueryPayMe("pending")).toBe(true)
    expect(shouldQueryPayMe("expired")).toBe(true)
    expect(shouldQueryPayMe("paid")).toBe(true)
    expect(shouldQueryPayMe("refunded")).toBe(false)
    expect(shouldQueryPayMe("failed")).toBe(false)
  })
})

describe("refundBlocker", () => {
  const paid = { status: "paid" as const, paymeSaleId: "SALE1" }
  const unused = { usedPunches: 0, status: "active" as const }

  test("a paid order with an unused card can be refunded", () => {
    expect(refundBlocker(paid, unused)).toBeNull()
  })

  test("a paid order whose card was deleted can still be refunded", () => {
    expect(refundBlocker(paid, null)).toBeNull()
  })

  test("a card with punches cannot be refunded from the admin", () => {
    expect(refundBlocker(paid, { ...unused, usedPunches: 1 })).toBe("cardUsed")
  })

  test("unpaid, legacy and already-cancelled orders are not refundable", () => {
    expect(refundBlocker({ ...paid, status: "pending" }, unused)).toBe(
      "notRefundable"
    )
    expect(refundBlocker({ ...paid, paymeSaleId: null }, unused)).toBe(
      "notRefundable"
    )
    expect(refundBlocker(paid, { ...unused, status: "cancelled" })).toBe(
      "notRefundable"
    )
  })
})
