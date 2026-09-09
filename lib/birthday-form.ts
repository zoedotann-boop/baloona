import type { RJSFSchema, UiSchema } from "@rjsf/utils"

import type { FormFieldType } from "@/lib/db/schema"
import { isValidIsraeliId } from "@/lib/israeli-id"

export interface BirthdayFormFieldView {
  key: string
  label: string
  placeholder?: string
  type: FormFieldType
  options: { value: string; label: string; days?: number[] }[]
  min?: number | null
  max?: number | null
  isRequired: boolean
}

export function weekdayFromDateInput(value: unknown): number | null {
  if (typeof value !== "string") return null
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
  if (!match) return null
  const [, year, month, day] = match
  return new Date(Number(year), Number(month) - 1, Number(day)).getDay()
}

export function optionAvailableForWeekday(
  option: { days?: number[] },
  weekday: number | null
): boolean {
  if (!option.days || option.days.length === 0) return true
  if (weekday === null) return true
  return option.days.includes(weekday)
}

const INPUT_TYPES: Partial<Record<FormFieldType, string>> = {
  tel: "tel",
  email: "email",
}

const PHONE_PATTERN = /^[0-9+\-()\s]{7,}$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const ISRAELI_ID_FORMAT = "israeli-id"
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
      return { type: "string", title, format: ISRAELI_ID_FORMAT }
    case "textarea":
      return { type: "string", title, maxLength: MAX_TEXTAREA_LENGTH }
    case "tel":
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

const CLOSED_DAYS_OF_WEEK = [6]

export function isClosedEventDate(value: string): boolean {
  const date = new Date(`${value}T00:00:00Z`)
  return (
    !Number.isNaN(date.getTime()) &&
    CLOSED_DAYS_OF_WEEK.includes(date.getUTCDay())
  )
}

export function isAnswerValid(
  field: Pick<BirthdayFormFieldView, "type" | "min" | "max">,
  value: string
): boolean {
  if (!value) return true
  switch (field.type) {
    case "date":
      return !isClosedEventDate(value)
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

export function buildBirthdayForm(fields: BirthdayFormFieldView[]): {
  schema: RJSFSchema
  uiSchema: UiSchema
} {
  const properties: Record<string, RJSFSchema> = {}
  const uiSchema: UiSchema = {
    "ui:submitButtonOptions": { norender: true },
    "ui:order": fields.map((field) => field.key),
  }

  for (const field of fields) {
    properties[field.key] = propertyFor(field)

    const ui: UiSchema[string] = {}
    if (field.type === "textarea") ui["ui:widget"] = "textarea"
    if (field.type === "date") {
      ui["ui:widget"] = "date"
      ui["ui:options"] = { disabledDaysOfWeek: CLOSED_DAYS_OF_WEEK }
    }
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
