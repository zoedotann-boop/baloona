import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva("inline-flex items-center gap-2 font-bold", {
  variants: {
    variant: {
      // White pill with shadow — used on the hero.
      pill: "rounded-full bg-white px-3.5 py-1.5 font-heading text-[13px] tracking-[0.12em] text-secondary-foreground uppercase",
      // Bare dot + label — used inline in the header.
      inline: "text-sm text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "inline",
  },
})

interface StatusBadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  label: string
  /** Green pulsing dot when open, red when closed. Defaults to open. */
  isOpen?: boolean
  /** Set false to freeze the pulsing dot (e.g. in snapshot tests). */
  animated?: boolean
}

/** Opening-status indicator: a pulsing dot (green when open, red when closed). */
function StatusBadge({
  className,
  variant,
  label,
  isOpen = true,
  animated = true,
  ...props
}: StatusBadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      <span
        className={cn(
          "size-[7px] rounded-full",
          isOpen ? "bg-brand-green" : "bg-red-500",
          animated && "animate-baloona-pulse"
        )}
      />
      {label}
    </span>
  )
}

export { StatusBadge }
