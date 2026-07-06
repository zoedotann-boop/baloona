import { BalloonClusterIcon } from "@/components/brand/balloon-cluster-icon"
import { cn } from "@/lib/utils"

interface FeatureItemProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  /** Petal color of the balloon icon. */
  color?: string
  iconSize?: number
}

/** Balloon icon + title (+ optional description). Used in the features grid. */
function FeatureItem({
  title,
  description,
  color,
  iconSize,
  className,
  ...props
}: FeatureItemProps) {
  return (
    <div
      className={cn("flex items-start gap-2.5 sm:gap-3.5", className)}
      {...props}
    >
      {/* Slightly smaller icon so two items fit per row on mobile. */}
      <BalloonClusterIcon color={color} size={iconSize ?? 44} />
      <div>
        <div className="text-[13px] font-extrabold text-foreground sm:text-[15px]">
          {title}
        </div>
        {description && (
          <div className="mt-0.5 text-[11px] text-brand-muted sm:mt-1 sm:text-xs">
            {description}
          </div>
        )}
      </div>
    </div>
  )
}

export { FeatureItem }
