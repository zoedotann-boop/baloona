import { cva, type VariantProps } from "class-variance-authority"
import { type ElementType } from "react"

import { cn } from "@/lib/utils"

const panelVariants = cva("relative rounded-[36px] p-8 md:p-12", {
  variants: {
    tone: {
      // Deep lavender with white text — the lead editorial surface.
      lavender: "bg-accent text-accent-foreground",
      mint: "bg-brand-mint text-foreground",
      banana: "bg-brand-banana text-foreground",
      pink: "bg-brand-pink text-secondary-foreground",
      white: "border border-border bg-white text-foreground",
    },
  },
  defaultVariants: { tone: "lavender" },
})

interface PanelProps
  extends
    React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof panelVariants> {
  /** Element to render as (e.g. "section"). Defaults to a div. */
  as?: ElementType
}

/**
 * Large rounded color panel — the recurring editorial surface for the Vision,
 * Pricing and Contact sections. One shared shape (radius + padding) keeps the
 * page visually cohesive; callers add `overflow-visible` when accent squares
 * should peek past the corners.
 */
function Panel({ as, tone, className, ...props }: PanelProps) {
  const Tag = as ?? "div"
  return <Tag className={cn(panelVariants({ tone }), className)} {...props} />
}

export { Panel }
