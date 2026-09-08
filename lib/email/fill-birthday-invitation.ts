import "server-only"

import fontkit from "@pdf-lib/fontkit"
import { type PDFFont, type PDFPage, PDFDocument, rgb } from "pdf-lib"

export interface InvitationValues {
  name?: string
  day?: string
  date?: string
}

const NAME = { y: 329, centerX: 209.75, size: 12 }
const DAY = { y: 282, rightX: 357, size: 10 }
const DATE = { y: 258, rightX: 339, size: 10 }

const INK = rgb(0.29, 0.13, 0.36)

function draw(
  page: PDFPage,
  text: string,
  anchor: { y: number; size: number; rightX?: number; centerX?: number },
  font: PDFFont
): void {
  const width = font.widthOfTextAtSize(text, anchor.size)
  const x =
    anchor.centerX !== undefined
      ? anchor.centerX - width / 2
      : (anchor.rightX ?? 0) - width
  page.drawText(text, { x, y: anchor.y, size: anchor.size, font, color: INK })
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

  return doc.save()
}
