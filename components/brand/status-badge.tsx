import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva("inline-flex items-center gap-2 font-bold", {
  variants: {
    variant: {
      pill: "rounded-full bg-white px-3.5 py-1.5 font-heading text-[13px] tracking-[0.12em] text-secondary-foreground uppercase",
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
  isOpen?: boolean
  animated?: boolean
}

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
