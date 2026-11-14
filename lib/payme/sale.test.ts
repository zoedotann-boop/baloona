import { describe, expect, test } from "bun:test"

import { parseSale, refundOutcome } from "@/lib/payme/sale"

describe("parseSale", () => {
  test("reads status and converts agorot to shekels", () => {
    expect(
      parseSale(
        [
          {
            sale_payme_id: "SALE1",
            sale_status: "completed",
            sale_price: 12000,
          },
        ],
        "SALE1"
      )
    ).toEqual({ status: "completed", amount: 120 })
  })

  test("picks the requested sale out of several", () => {
    expect(
      parseSale(
        [
          { sale_payme_id: "OTHER", sale_status: "failed", sale_price: 100 },
          { sale_payme_id: "SALE1", sale_status: "refunded", sale_price: 5000 },
        ],
        "SALE1"
      )
    ).toEqual({ status: "refunded", amount: 50 })
  })

  test("accepts a numeric string price", () => {
    expect(
      parseSale(
        [
          {
            sale_payme_id: "SALE1",
            sale_status: "completed",
            sale_price: "9900",
          },
        ],
        "SALE1"
      )?.amount
    ).toBe(99)
  })

  test("returns null when the sale is missing or malformed", () => {
    expect(parseSale(undefined, "SALE1")).toBeNull()
    expect(parseSale([], "SALE1")).toBeNull()
    expect(
      parseSale([{ sale_payme_id: "SALE1", sale_price: 100 }], "SALE1")
    ).toBeNull()
    expect(
      parseSale(
        [{ sale_payme_id: "SALE1", sale_status: "completed", sale_price: "x" }],
        "SALE1"
      )
    ).toBeNull()
  })
})

describe("refundOutcome", () => {
  test("status code 0 means refunded", () => {
    expect(refundOutcome({ status_code: 0, sale_status: "refunded" })).toBe(
      "refunded"
    )
  })

  test("a definite PayMe error is a rejection", () => {
    expect(refundOutcome({ status_code: 1, status_error_code: 309 })).toBe(
      "rejected"
    )
  })

  test("timeouts and in-flight codes leave the outcome unknown", () => {
    expect(refundOutcome(null)).toBe("unknown")
    expect(refundOutcome({ status_code: 1, status_error_code: 998 })).toBe(
      "unknown"
    )
    expect(refundOutcome({ status_code: 1, status_error_code: 20002 })).toBe(
      "unknown"
    )
  })
})
