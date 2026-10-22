import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"

import { PDFDocument } from "pdf-lib"

import { fillBirthdayInvitation } from "@/lib/email/fill-birthday-invitation"

const template = readFile("public/birthday-invitation.pdf")
const font = readFile("public/fonts/Fredoka-Medium.ttf")

async function fill(address?: string) {
  const bytes = await fillBirthdayInvitation(
    new Uint8Array(await template),
    new Uint8Array(await font),
    {
      name: "נועה",
      day: "שלישי",
      date: "27.10.2026",
      time: "17:00",
      address,
      footer: "טלפון: 0545060042 | www.baloona.co.il",
    }
  )
  return PDFDocument.load(bytes)
}

describe("fillBirthdayInvitation", () => {
  test("fills a short branch address", async () => {
    const doc = await fill("רחוב ההדרים 7, צים אורבן גני תקווה קומה 1")
    expect(doc.getPageCount()).toBe(2)
  })

  test("fills a long branch address", async () => {
    const doc = await fill(
      "רחוב שלמה המלך 37 (קניון קרית אונו) בניין B קומה מינוס 2"
    )
    expect(doc.getPageCount()).toBe(2)
  })

  test("still fills the footer when the branch has no address", async () => {
    const doc = await fill(undefined)
    expect(doc.getPageCount()).toBe(2)
  })
})
