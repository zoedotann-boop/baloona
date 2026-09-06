import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextResponse, type NextRequest } from "next/server"

import { canWriteMediaKey, parseMediaKey } from "@/lib/admin/media-access"

const MAX_BYTES = 10 * 1024 * 1024

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const key = parseMediaKey(pathname)
        if (!key) throw new Error("Invalid upload key.")
        if (!(await canWriteMediaKey(key))) throw new Error("Forbidden.")

        return {
          allowedContentTypes: ["image/*"],
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: false,
        }
      },
      onUploadCompleted: async () => {},
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "upload-failed" },
      { status: 400 }
    )
  }
}
