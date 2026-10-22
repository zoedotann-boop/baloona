import "server-only"

import fontkit from "@pdf-lib/fontkit"
import { type PDFFont, type PDFPage, PDFDocument, rgb } from "pdf-lib"

import { fitTwoLines, pdfTextRuns } from "@/lib/email/invitation-text"

export interface InvitationValues {
  name?: string
  day?: string
  date?: string
  time?: string
  address?: string
  footer: string
}

type Anchor = { y: number; size: number } & (
  { rightX: number } | { centerX: number }
)

const NAME = { y: 329, centerX: 209.75, size: 12 }
const DAY = { y: 282, rightX: 357, size: 10 }
const DATE = { y: 258, rightX: 339, size: 10 }
const TIME = { y: 234, rightX: 340, size: 10 }
const FOOTER = { y: 21.47, centerX: 209.76, size: 10 }

const ADDRESS_BOX = {
  centerX: 225.8,
  maxWidth: 128,
  size: 10,
  baselines: { 1: [158.97], 2: [161, 148] } as Record<number, number[]>,
}

const INK = rgb(0, 0, 0)

function draw(page: PDFPage, text: string, anchor: Anchor, font: PDFFont) {
  const runs = pdfTextRuns(text).map((run) => ({
    run,
    width: font.widthOfTextAtSize(run, anchor.size),
  }))
  const width = runs.reduce((sum, { width }) => sum + width, 0)
  let x =
    "centerX" in anchor ? anchor.centerX - width / 2 : anchor.rightX - width
  for (const { run, width } of runs) {
    page.drawText(run, { x, y: anchor.y, size: anchor.size, font, color: INK })
    x += width
  }
}

function drawAddress(page: PDFPage, address: string, font: PDFFont) {
  const { centerX, maxWidth, size, baselines } = ADDRESS_BOX
  const { lines, scale } = fitTwoLines(
    address,
    (line) => font.widthOfTextAtSize(line, size),
    maxWidth
  )
  lines.forEach((line, index) =>
    draw(
      page,
      line,
      { centerX, y: baselines[lines.length][index], size: size * scale },
      font
    )
  )
}

export async function fillBirthdayInvitation(
  pdfBytes: Uint8Array,
  fontBytes: Uint8Array,
  values: InvitationValues
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(pdfBytes)
  doc.registerFontkit(fontkit)
  const font = await doc.embedFont(fontBytes, { subset: true })
  const page = doc.getPage(0)

  if (values.name) draw(page, values.name, NAME, font)
  if (values.day) draw(page, values.day, DAY, font)
  if (values.date) draw(page, values.date, DATE, font)
  if (values.time) draw(page, values.time, TIME, font)
  if (values.address) drawAddress(page, values.address, font)
  draw(page, values.footer, FOOTER, font)

  return doc.save()
}
