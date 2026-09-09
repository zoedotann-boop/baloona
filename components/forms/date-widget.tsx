"use client"

import type { WidgetProps } from "@rjsf/utils"
import { ariaDescribedByIds } from "@rjsf/utils"

import { DateField } from "@/components/brand/date-field"

function DateWidget({
  id,
  value,
  disabled,
  readonly,
  placeholder,
  options,
  rawErrors = [],
  onChange,
}: WidgetProps) {
  const disabledDaysOfWeek = options.disabledDaysOfWeek as number[] | undefined

  return (
    <DateField
      id={id}
      value={value ?? undefined}
      placeholder={placeholder}
      disabled={disabled || readonly}
      disabledDaysOfWeek={disabledDaysOfWeek}
      invalid={rawErrors.length > 0}
      aria-describedby={ariaDescribedByIds(id)}
      onChange={(next) => onChange(next ?? options.emptyValue)}
    />
  )
}

export { DateWidget }
