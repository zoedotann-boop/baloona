import { describe, expect, test } from "bun:test"

import {
  fitTwoLines,
  pdfTextRuns,
  visualText,
} from "@/lib/email/invitation-text"

describe("visualText", () => {
  test("reverses plain Hebrew", () => {
    expect(visualText("גני תקווה")).toBe("הווקת ינג")
  })

  test("keeps numbers and Latin words left-to-right inside Hebrew", () => {
    expect(
      visualText("רחוב שלמה המלך 37 (קניון קרית אונו) בניין B קומה מינוס 2")
    ).toBe("2 סונימ המוק B ןיינב (ונוא תירק ןוינק) 37 ךלמה המלש בוחר")
  })

  test("puts the Hebrew phone label on the right of the footer", () => {
    expect(visualText("טלפון: 03-6878016 | www.baloona.co.il")).toBe(
      "www.baloona.co.il | 03-6878016 :ןופלט"
    )
  })

  test("leaves Latin-only text untouched", () => {
    expect(visualText("17:30")).toBe("17:30")
  })
})

describe("pdfTextRuns", () => {
  test("splits into left-to-right runs with Hebrew words in reading order", () => {
    expect(pdfTextRuns("רחוב הגליל 5")).toEqual(["5 ", "הגליל", " ", "רחוב"])
  })

  test("keeps a one-word Hebrew name as one run", () => {
    expect(pdfTextRuns("נועה")).toEqual(["נועה"])
  })

  test("returns nothing for empty text", () => {
    expect(pdfTextRuns("")).toEqual([])
  })
})

describe("fitTwoLines", () => {
  const measure = (line: string) => line.length

  test("keeps text that fits on one line", () => {
    expect(fitTwoLines("רחוב הגליל 5", measure, 20)).toEqual({
      lines: ["רחוב הגליל 5"],
      scale: 1,
    })
  })

  test("splits long text into the most balanced two lines", () => {
    expect(fitTwoLines("aaaa bb cc dddd", measure, 10)).toEqual({
      lines: ["aaaa bb", "cc dddd"],
      scale: 1,
    })
  })

  test("prefers breaking after a comma when both lines fit", () => {
    expect(fitTwoLines("a, bbbb cc dd", measure, 10).lines).toEqual([
      "a,",
      "bbbb cc dd",
    ])
  })

  test("ignores a comma break that would overflow", () => {
    expect(fitTwoLines("aa, bbbbbb cccccc", measure, 10).lines).toEqual([
      "aa, bbbbbb",
      "cccccc",
    ])
  })

  test("shrinks when even the balanced lines are too wide", () => {
    const { lines, scale } = fitTwoLines("aaaaaaaa bbbbbbbb", measure, 4)
    expect(lines).toEqual(["aaaaaaaa", "bbbbbbbb"])
    expect(scale).toBe(0.5)
  })

  test("shrinks a single word that is too wide", () => {
    expect(fitTwoLines("aaaaaaaaaa", measure, 5)).toEqual({
      lines: ["aaaaaaaaaa"],
      scale: 0.5,
    })
  })

  test("collapses extra whitespace", () => {
    expect(fitTwoLines("  a   b  ", measure, 10).lines).toEqual(["a b"])
  })

  test("returns no lines for blank text", () => {
    expect(fitTwoLines("   ", measure, 10)).toEqual({ lines: [], scale: 1 })
  })
})
