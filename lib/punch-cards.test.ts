import { describe, expect, test } from "bun:test"

import { nextCardStatus } from "@/lib/punch-cards"

describe("nextCardStatus", () => {
  test("follows the punch count for live cards", () => {
    expect(nextCardStatus("active", 3, 10)).toBe("active")
    expect(nextCardStatus("active", 10, 10)).toBe("completed")
    expect(nextCardStatus("completed", 4, 10)).toBe("active")
  })

  test("a cancelled card stays cancelled whatever its punches", () => {
    expect(nextCardStatus("cancelled", 0, 10)).toBe("cancelled")
    expect(nextCardStatus("cancelled", 10, 10)).toBe("cancelled")
  })
})
