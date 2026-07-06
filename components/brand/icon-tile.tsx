import { cva, type VariantProps } from "class-variance-authority"

import { Icon, type IconName } from "@/components/brand/icon"
import { cn } from "@/lib/utils"

const tileVariants = cva(
  "flex shrink-0 items-center justify-center rounded-2xl",
  {
    variants: {
      tone: {
        pink: "bg-brand-pink text-[#c25e79]",
        sky: "bg-brand-sky text-brand-sky-ink",
        cream: "bg-brand-cream text-brand-brown",
        coral: "bg-primary text-primary-foreground",
        soft: "bg-secondary text-brand-brown",
      },
      size: {
        sm: "size-10 [&_svg]:size-5",
        md: "size-12 [&_svg]:size-6",
      },
    },
    defaultVariants: { tone: "pink", size: "md" },
  }
)

interface IconTileProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tileVariants> {
  icon: IconName
}

/** Rounded square holding a Lucide icon, in a soft brand tone. */
function IconTile({ icon, tone, size, className, ...props }: IconTileProps) {
  return (
    <div className={cn(tileVariants({ tone, size }), className)} {...props}>
      <Icon name={icon} />
    </div>
  )
}

export { IconTile }
