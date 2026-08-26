import type { RJSFSchema, UiSchema } from "@rjsf/utils"

import type { FormFieldType } from "@/lib/db/schema"
import { isValidIsraeliId } from "@/lib/israeli-id"

/** One editor-defined question, already resolved for the active locale. */
export interface BirthdayFormFieldView {
  key: string
  label: string
  placeholder?: string
  type: FormFieldType
  options: { value: string; label: string }[]
  /** Inclusive bounds for `number` fields (e.g. a 25-guest minimum). */
  min?: number | null
  max?: number | null
  isRequired: boolean
}

/** HTML input type for the field types that are otherwise plain strings. */
const INPUT_TYPES: Partial<Record<FormFieldType, string>> = {
  tel: "tel",
  email: "email",
}

/**
 * Boundaries shared by the schema (client-side AJV) and `isAnswerValid`
 * (server-side re-check) so a single edit moves both in step.
 */
const PHONE_PATTERN = /^[0-9+\-()\s]{7,}$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
/** AJV custom format name, registered on the client validator. */
export const ISRAELI_ID_FORMAT = "israeli-id"
/** Free-text caps that trip the localized "too long" message. */
const MAX_TEXT_LENGTH = 120
const MAX_TEXTAREA_LENGTH = 1000

function propertyFor(field: BirthdayFormFieldView): RJSFSchema {
  const title = field.label

  switch (field.type) {
    case "number": {
      const schema: RJSFSchema = {
        type: "number",
        title,
        minimum: field.min ?? 0,
      }
      if (field.max != null) schema.maximum = field.max
      return schema
    }
    case "checkbox":
      return { type: "boolean", title }
    case "date":
      return { type: "string", format: "date", title }
    case "email":
      return { type: "string", format: "email", title }
    case "id":
      // A `format` error carrying `israeli-id` maps to a localized "invalid ID"
      // message in the form component.
      return { type: "string", title, format: ISRAELI_ID_FORMAT }
    case "textarea":
      return { type: "string", title, maxLength: MAX_TEXTAREA_LENGTH }
    case "tel":
      // Digits, spaces and the usual phone punctuation; a `pattern` error is
      // mapped to a localized "invalid phone" message in the form component.
      return { type: "string", title, pattern: PHONE_PATTERN.source }
    case "select":
      return {
        type: "string",
        title,
        oneOf: field.options.map((option) => ({
          const: option.value,
          title: option.label,
        })),
      }
    default:
      return { type: "string", title, maxLength: MAX_TEXT_LENGTH }
  }
}

/**
 * Re-check a submitted answer against its field type on the server.
 *
 * The client validator (AJV) already rejects malformed input, but the action is
 * unauthenticated and must not trust the payload, so it runs the same
 * type-level rules again. An empty value is treated as valid here — the
 * required check is handled separately.
 */
export function isAnswerValid(
  field: Pick<BirthdayFormFieldView, "type" | "min" | "max">,
  value: string
): boolean {
  if (!value) return true
  switch (field.type) {
    case "id":
      return isValidIsraeliId(value)
    case "email":
      return EMAIL_PATTERN.test(value)
    case "tel":
      return PHONE_PATTERN.test(value)
    case "number": {
      const parsed = Number(value)
      if (!Number.isFinite(parsed)) return false
      if (parsed < (field.min ?? 0)) return false
      if (field.max != null && parsed > field.max) return false
      return true
    }
    case "text":
      return value.length <= MAX_TEXT_LENGTH
    case "textarea":
      return value.length <= MAX_TEXTAREA_LENGTH
    default:
      return true
  }
}

/**
 * Compile the location's field rows into a JSON Schema pair for `@rjsf/shadcn`.
 *
 * The booking form is editor-defined, so the schema is derived at render time
 * rather than hard-coded. Keeping the compiler here — not in the component —
 * means the same rows describe the rendered form, the client-side validation
 * and the server-side check in `submitBirthdayLead`.
 */
export function buildBirthdayForm(fields: BirthdayFormFieldView[]): {
  schema: RJSFSchema
  uiSchema: UiSchema
} {
  const properties: Record<string, RJSFSchema> = {}
  const uiSchema: UiSchema = {
    // The card renders its own heading and submit button.
    "ui:submitButtonOptions": { norender: true },
    "ui:order": fields.map((field) => field.key),
  }

  for (const field of fields) {
    properties[field.key] = propertyFor(field)

    const ui: UiSchema[string] = {}
    if (field.type === "textarea") ui["ui:widget"] = "textarea"
    const inputType = INPUT_TYPES[field.type]
    if (inputType) ui["ui:options"] = { inputType }
    if (field.placeholder) ui["ui:placeholder"] = field.placeholder
    if (Object.keys(ui).length > 0) uiSchema[field.key] = ui
  }

  return {
    schema: {
      type: "object",
      properties,
      required: fields
        .filter((field) => field.isRequired)
        .map((field) => field.key),
    },
    uiSchema,
  }
}
