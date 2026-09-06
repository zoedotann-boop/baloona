"use client"

import { useId } from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

interface ConsentCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  children: React.ReactNode
  className?: string
}

function ConsentCheckbox({
  checked,
  onChange,
  children,
  className,
}: ConsentCheckboxProps) {
  const id = useId()
  const labelId = useId()

  return (
    <div className={cn("flex items-start gap-3", className)}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        aria-labelledby={labelId}
        className="peer sr-only"
      />
      <label
        htmlFor={id}
        className={cn(
          "mt-0.5 flex size-5 flex-none cursor-pointer items-center justify-center rounded-md border transition peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50",
          checked
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-muted"
        )}
      >
        {checked && <Check className="size-3.5" strokeWidth={3} aria-hidden />}
      </label>
      <span
        id={labelId}
        className="flex-1 text-[15px] leading-relaxed text-foreground"
      >
        {children}
      </span>
    </div>
  )
}

export { ConsentCheckbox }
