import { IconTile } from "@/components/brand/icon-tile"
import { type IconName } from "@/components/brand/icon"
import { cn } from "@/lib/utils"

interface StepCardProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number
  icon: IconName
  title: string
  sub?: string
  tone?: React.ComponentProps<typeof IconTile>["tone"]
}

/** Numbered step card with an icon tile — used in "how it works" grids. */
function StepCard({
  index,
  icon,
  title,
  sub,
  tone,
  className,
  ...props
}: StepCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-[26px] border border-[#f3d3d9] bg-white p-6 shadow-[0_14px_36px_-24px_rgba(90,39,64,0.5)]",
        className
      )}
      {...props}
    >
      <div className="absolute -top-3 -right-3 flex size-7 items-center justify-center rounded-full bg-primary font-heading text-[12px] font-black text-primary-foreground">
        {index}
      </div>
      <IconTile icon={icon} tone={tone} className="mb-4" />
      <div className="font-heading text-[15px] font-black text-brand-brown">
        {title}
      </div>
      {sub && <div className="mt-1 text-[12px] text-brand-muted">{sub}</div>}
    </div>
  )
}

export { StepCard }
