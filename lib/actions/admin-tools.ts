"use server"

import { z } from "zod"

import { translateValues } from "@/lib/ai/translate"
import { requireLocationAccess } from "@/lib/admin/access"
import { buildObjectKey, createPresignedUpload } from "@/lib/storage"

/**
 * Editor tools shared by every admin section: AI-drafted translations and
 * direct-to-R2 uploads. Both are gated on the caller having access to the
 * location they name.
 */

const translateSchema = z.object({
  slug: z.string().min(1),
  values: z.array(z.string()).min(1).max(50),
  from: z.enum(["he", "en"]),
  to: z.enum(["he", "en"]),
})

export async function translateForLocation(
  input: z.input<typeof translateSchema>
): Promise<{ ok: true; values: string[] } | { ok: false; error: string }> {
  await requireLocationAccess(input.slug)

  const parsed = translateSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }
  return translateValues(parsed.data.values, parsed.data.from, parsed.data.to)
}

const uploadSchema = z.object({
  slug: z.string().min(1),
  folder: z.enum(["gallery", "hero", "steps", "branding"]),
  fileName: z.string().min(1).max(200),
  contentType: z.string().startsWith("image/"),
})

/** Presigned PUT so the browser uploads straight to R2. */
export async function createMediaUpload(
  input: z.input<typeof uploadSchema>
): Promise<
  { ok: true; uploadUrl: string; url: string } | { ok: false; error: string }
> {
  const { location } = await requireLocationAccess(input.slug)

  const parsed = uploadSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }

  try {
    const key = buildObjectKey(
      location.slug,
      parsed.data.folder,
      parsed.data.fileName
    )
    const { uploadUrl, url } = await createPresignedUpload(
      key,
      parsed.data.contentType
    )
    return { ok: true, uploadUrl, url }
  } catch (error) {
    return { ok: false, error: (error as Error).message }
  }
}
