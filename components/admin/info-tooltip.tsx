"use client"

import { Info } from "lucide-react"

import { cn } from "@/lib/utils"

function InfoTooltip({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  return (
    <span className={cn("group relative inline-flex", className)}>
      <button
        type="button"
        aria-label={text}
        className="inline-flex size-4 items-center justify-center rounded-full text-muted-foreground/70 transition hover:text-brand-plum focus-visible:text-brand-plum focus-visible:outline-none"
      >
        <Info className="size-3.5" aria-hidden />
      </button>
      <span
        aria-hidden
        className="pointer-events-none absolute start-0 top-full z-20 mt-1.5 w-max max-w-[260px] rounded-xl bg-brand-plum px-3 py-2 text-[12px] leading-snug font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100"
      >
        {text}
      </span>
    </span>
  )
}

export { InfoTooltip }
