import { NextResponse, type NextRequest } from "next/server"

import { canWriteMediaKey, parseMediaKey } from "@/lib/admin/media-access"
import { usingLocalStorage } from "@/lib/storage"
import { writeObject } from "@/lib/storage/local"

const MAX_BYTES = 10 * 1024 * 1024

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  if (!usingLocalStorage()) {
    return NextResponse.json({ error: "not-found" }, { status: 404 })
  }

  const { key: segments } = await params
  const key = parseMediaKey(segments.join("/"))
  if (!key) {
    return NextResponse.json({ error: "invalid-key" }, { status: 400 })
  }
  if (!(await canWriteMediaKey(key))) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }

  if (!(request.headers.get("content-type") ?? "").startsWith("image/")) {
    return NextResponse.json({ error: "unsupported" }, { status: 415 })
  }

  const body = new Uint8Array(await request.arrayBuffer())
  if (body.byteLength === 0) {
    return NextResponse.json({ error: "empty" }, { status: 400 })
  }
  if (body.byteLength > MAX_BYTES) {
    return NextResponse.json({ error: "too-large" }, { status: 413 })
  }

  await writeObject(segments.join("/"), body)
  return NextResponse.json({ ok: true })
}
