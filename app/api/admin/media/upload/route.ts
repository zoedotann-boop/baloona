import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextResponse, type NextRequest } from "next/server"

import { canWriteMediaKey, parseMediaKey } from "@/lib/admin/media-access"

/**
 * Signs client-upload tokens for Vercel Blob.
 *
 * The admin's image field calls the SDK's `upload()`, which posts here to get a
 * short-lived token before PUTting bytes straight to Blob. This route is the
 * authorization boundary: `onBeforeGenerateToken` runs on our server, so it
 * re-parses the requested pathname and confirms the caller may write to that
 * branch — never trusting that the client asked for a key it earlier received.
 */

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
          // The key already carries a random id from `buildObjectKey`.
          addRandomSuffix: false,
        }
      },
      // Required by the SDK. The uploaded URL is persisted through the normal
      // section-save flow, so there is nothing to reconcile here (and this
      // callback never fires on localhost anyway).
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
