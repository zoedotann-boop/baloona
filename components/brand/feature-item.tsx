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
  iconSize = 50,
  className,
  ...props
}: FeatureItemProps) {
  return (
    <div className={cn("flex items-start gap-3.5", className)} {...props}>
      <BalloonClusterIcon color={color} size={iconSize} />
      <div>
        <div className="text-[15px] font-extrabold text-foreground">
          {title}
        </div>
        {description && (
          <div className="mt-1 text-xs text-brand-muted">{description}</div>
        )}
      </div>
    </div>
  )
}

export { FeatureItem }
