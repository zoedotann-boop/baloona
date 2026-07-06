import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva("inline-flex items-center gap-2 font-bold", {
  variants: {
    variant: {
      // White pill with shadow — used on the hero.
      pill: "rounded-full bg-white px-3.5 py-1.5 font-heading text-[11px] tracking-[0.12em] text-[#7a3b4f] uppercase shadow-[0_6px_16px_-8px_rgba(90,39,64,0.3)]",
      // Bare dot + label — used inline in the header.
      inline: "text-xs text-muted-foreground",
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
  /** Set false to freeze the pulsing dot (e.g. in snapshot tests). */
  animated?: boolean
}

/** "Open now" indicator with a pulsing green dot. */
function StatusBadge({
  className,
  variant,
  label,
  animated = true,
  ...props
}: StatusBadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      <span
        className={cn(
          "size-[7px] rounded-full bg-brand-green",
          animated && "animate-baloona-pulse"
        )}
      />
      {label}
    </span>
  )
}

export { StatusBadge }
