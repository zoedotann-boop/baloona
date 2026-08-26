import type { RJSFSchema, UiSchema } from "@rjsf/utils"

import type { FormFieldType } from "@/lib/db/schema"

/** One editor-defined question, already resolved for the active locale. */
export interface BirthdayFormFieldView {
  key: string
  label: string
  placeholder?: string
  type: FormFieldType
  options: { value: string; label: string }[]
  isRequired: boolean
}

/** HTML input type for the field types that are otherwise plain strings. */
const INPUT_TYPES: Partial<Record<FormFieldType, string>> = {
  tel: "tel",
  email: "email",
}

function propertyFor(field: BirthdayFormFieldView): RJSFSchema {
  const title = field.label

  switch (field.type) {
    case "number":
      return { type: "number", title, minimum: 0 }
    case "checkbox":
      return { type: "boolean", title }
    case "date":
      return { type: "string", format: "date", title }
    case "email":
      return { type: "string", format: "email", title }
    case "tel":
      // Digits, spaces and the usual phone punctuation; a `pattern` error is
      // mapped to a localized "invalid phone" message in the form component.
      return { type: "string", title, pattern: "^[0-9+\\-()\\s]{7,}$" }
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
      return { type: "string", title }
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
