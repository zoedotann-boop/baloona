"use client"

import * as Popover from "@radix-ui/react-popover"
import { CalendarDays } from "lucide-react"
import { useState } from "react"
import { DayPicker } from "react-day-picker"
import { he } from "react-day-picker/locale"
import "react-day-picker/style.css"

import { cn } from "@/lib/utils"

interface DateFieldProps {
  id?: string
  value?: string
  onChange?: (value: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  disabledDaysOfWeek?: number[]
  invalid?: boolean
  "aria-describedby"?: string
  className?: string
}

const LABEL_FORMAT = new Intl.DateTimeFormat("he-IL", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
})

function toISODate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function fromISODate(value?: string): Date | undefined {
  if (!value) return undefined
  const [year, month, day] = value.split("-").map(Number)
  if (!year || !month || !day) return undefined
  return new Date(year, month - 1, day)
}

function DateField({
  id,
  value,
  onChange,
  placeholder,
  disabled,
  disabledDaysOfWeek,
  invalid,
  "aria-describedby": describedBy,
  className,
}: DateFieldProps) {
  const [open, setOpen] = useState(false)
  const selected = fromISODate(value)

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          id={id}
          disabled={disabled}
          aria-describedby={describedBy}
          className={cn(
            "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 md:text-sm",
            invalid && "border-destructive",
            !selected && "text-muted-foreground",
            className
          )}
        >
          <span>{selected ? LABEL_FORMAT.format(selected) : placeholder}</span>
          <CalendarDays className="size-4 shrink-0 text-brand-plum" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          className="z-50 rounded-2xl border border-border bg-white p-3 shadow-lg"
        >
          <DayPicker
            className="brand-day-picker"
            mode="single"
            locale={he}
            dir="rtl"
            showOutsideDays
            selected={selected}
            defaultMonth={selected}
            disabled={
              disabledDaysOfWeek ? { dayOfWeek: disabledDaysOfWeek } : undefined
            }
            onSelect={(date) => {
              onChange?.(date ? toISODate(date) : undefined)
              setOpen(false)
            }}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export { DateField }
