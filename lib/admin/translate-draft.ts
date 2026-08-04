import { defaultLocale, type Locale } from "@/i18n/routing"
import type { Localized, LocalizedList } from "@/lib/localized"

/**
 * Fill every translatable value in an admin draft in one pass.
 *
 * Admin drafts are plain objects whose translatable leaves are all
 * `{ he, en }` (or `{ he: string[] }`) shapes, so one generic walk powers the
 * "translate this page" button on every section instead of each form growing
 * its own translation plumbing.
 */

type TextNode = { kind: "text"; node: Localized }
type ListNode = { kind: "list"; node: LocalizedList }
type Node = TextNode | ListNode

/** How many strings to send per request, to keep prompts a sane size. */
const CHUNK_SIZE = 40

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function collect(value: unknown, out: Node[]): void {
  if (Array.isArray(value)) {
    for (const item of value) collect(item, out)
    return
  }
  if (!isPlainObject(value)) return

  const he = value[defaultLocale]
  if (typeof he === "string") {
    out.push({ kind: "text", node: value as unknown as Localized })
    return
  }
  if (Array.isArray(he) && he.every((item) => typeof item === "string")) {
    out.push({ kind: "list", node: value as unknown as LocalizedList })
    return
  }

  for (const child of Object.values(value)) collect(child, out)
}

export type TranslateFn = (values: string[]) => Promise<string[] | null>

/**
 * Return a copy of `draft` with `locale` filled in from the Hebrew source.
 * Resolves to `null` when the translation service fails, so the caller can show
 * an error and leave the draft untouched.
 */
export async function translateDraft<T>(
  draft: T,
  locale: Locale,
  translate: TranslateFn
): Promise<T | null> {
  const clone = structuredClone(draft)
  const nodes: Node[] = []
  collect(clone, nodes)

  // Flatten to one list of strings, remembering where each came from.
  const sources: string[] = []
  const spans: { node: Node; start: number; length: number }[] = []
  for (const node of nodes) {
    const values = node.kind === "text" ? [node.node.he] : [...node.node.he]
    spans.push({ node, start: sources.length, length: values.length })
    sources.push(...values)
  }

  if (sources.length === 0) return clone

  const translated: string[] = []
  for (let index = 0; index < sources.length; index += CHUNK_SIZE) {
    const chunk = sources.slice(index, index + CHUNK_SIZE)
    const result = await translate(chunk)
    if (!result) return null
    translated.push(...result)
  }

  for (const { node, start, length } of spans) {
    const values = translated.slice(start, start + length)
    if (node.kind === "text") node.node[locale] = values[0] ?? ""
    else node.node[locale] = values
  }

  return clone
}
