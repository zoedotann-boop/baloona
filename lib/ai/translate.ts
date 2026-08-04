import "server-only"

import { GoogleGenAI } from "@google/genai"

import { type Locale } from "@/i18n/routing"
import { geminiApiKey } from "@/lib/env"

/** Flash is fast and cheap, and this is short marketing copy, not reasoning. */
const MODEL = "gemini-2.5-flash"

const LANGUAGE_NAMES: Record<Locale, string> = {
  he: "Hebrew",
  en: "English",
}

export type TranslationResult =
  { ok: true; values: string[] } | { ok: false; error: string }

/**
 * Draft translations for the admin's "מלא עם AI" button.
 *
 * The output is a starting point an editor reviews and corrects, never
 * published blind — which is why it returns plain strings and the admin form
 * drops them straight into an editable input.
 */
export async function translateValues(
  values: string[],
  from: Locale,
  to: Locale
): Promise<TranslationResult> {
  const apiKey = geminiApiKey()
  if (!apiKey) return { ok: false, error: "missing-key" }

  const nonEmpty = values.some((value) => value.trim())
  if (!nonEmpty) return { ok: true, values: values.map(() => "") }

  const prompt = [
    `Translate each string from ${LANGUAGE_NAMES[from]} to ${LANGUAGE_NAMES[to]}.`,
    "This is website copy for Baloona, an indoor playground and café for children in Israel.",
    "Keep the tone warm, short and marketing-friendly. Preserve emoji, prices, numbers and brand names.",
    "Return a JSON array of strings with exactly the same length and order as the input, and nothing else.",
    "",
    JSON.stringify(values),
  ].join("\n")

  try {
    const response = await new GoogleGenAI({ apiKey }).models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: { type: "string" },
        },
      },
    })

    const parsed: unknown = JSON.parse(response.text ?? "[]")
    if (!Array.isArray(parsed)) return { ok: false, error: "bad-response" }

    return {
      ok: true,
      values: values.map((_, index) => String(parsed[index] ?? "")),
    }
  } catch (error) {
    return { ok: false, error: (error as Error).message }
  }
}
