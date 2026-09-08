import { cva, type VariantProps } from "class-variance-authority"
import { type ElementType } from "react"

import { cn } from "@/lib/utils"

const panelVariants = cva("relative rounded-[36px] p-8 md:p-12", {
  variants: {
    tone: {
      pink: "bg-brand-pink text-secondary-foreground",
      mint: "bg-brand-mint text-foreground",
      banana: "bg-brand-banana text-foreground",
      white: "border border-border bg-white text-foreground",
    },
  },
  defaultVariants: { tone: "pink" },
})

interface PanelProps
  extends
    React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof panelVariants> {
  as?: ElementType
}

function Panel({ as, tone, className, ...props }: PanelProps) {
  const Tag = as ?? "div"
  return <Tag className={cn(panelVariants({ tone }), className)} {...props} />
}

export { Panel }
