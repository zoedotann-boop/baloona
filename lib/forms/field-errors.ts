/**
 * Reduce a failed zod `safeParse` to one message per field.
 *
 * Copy stays in `messages/*.json`: the caller passes a translator scoped to the
 * `forms` namespace, and the message is chosen from the field and its value —
 * an empty value reads as "required", a bad phone/email reads as its format
 * message, and anything else falls back to a generic "too long".
 */
export type FieldErrors = Record<string, string>

export function collectFieldErrors(
  issues: readonly { path: PropertyKey[] }[],
  values: Record<string, unknown>,
  t: (key: "required" | "invalidPhone" | "invalidEmail" | "tooLong") => string
): FieldErrors {
  const errors: FieldErrors = {}
  for (const issue of issues) {
    const field = String(issue.path[0] ?? "")
    if (!field || errors[field]) continue
    const value = values[field]
    if (typeof value !== "string" || value.trim() === "") {
      errors[field] = t("required")
    } else if (field === "phone") {
      errors[field] = t("invalidPhone")
    } else if (field === "email") {
      errors[field] = t("invalidEmail")
    } else {
      errors[field] = t("tooLong")
    }
  }
  return errors
}
