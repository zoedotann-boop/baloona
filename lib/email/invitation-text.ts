import bidiFactory from "bidi-js"

const bidi = bidiFactory()

const HEBREW = /[֐-׿]/
const DIRECTION_RUNS = /[֐-׿]+|[^֐-׿]+/g

export function visualText(text: string): string {
  return bidi.getReorderedString(text, bidi.getEmbeddingLevels(text, "rtl"))
}

export function pdfTextRuns(text: string): string[] {
  return (visualText(text).match(DIRECTION_RUNS) ?? []).map((run) =>
    HEBREW.test(run) ? [...run].reverse().join("") : run
  )
}

export interface FittedLines {
  lines: string[]
  scale: number
}

export function fitTwoLines(
  text: string,
  measure: (line: string) => number,
  maxWidth: number
): FittedLines {
  const words = text.trim().split(/\s+/).filter(Boolean)
  const whole = words.join(" ")
  if (!whole) return { lines: [], scale: 1 }

  const widestOf = (lines: string[]) => Math.max(...lines.map(measure))
  const lines =
    words.length < 2 || measure(whole) <= maxWidth
      ? [whole]
      : bestSplit(twoLineSplits(words), widestOf, maxWidth)

  return { lines, scale: Math.min(1, maxWidth / widestOf(lines)) }
}

function twoLineSplits(words: string[]): string[][] {
  return words
    .slice(1)
    .map((_, index) => [
      words.slice(0, index + 1).join(" "),
      words.slice(index + 1).join(" "),
    ])
}

function bestSplit(
  splits: string[][],
  widestOf: (lines: string[]) => number,
  maxWidth: number
): string[] {
  const byBalance = (a: string[], b: string[]) => widestOf(a) - widestOf(b)
  const atComma = splits.filter(
    (lines) => lines[0].endsWith(",") && widestOf(lines) <= maxWidth
  )
  return (atComma.length > 0 ? atComma : splits).sort(byBalance)[0]
}
