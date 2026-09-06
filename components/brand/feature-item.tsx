import { BalloonClusterIcon } from "@/components/brand/balloon-cluster-icon"
import { cn } from "@/lib/utils"

interface FeatureItemProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  color?: string
  iconSize?: number
  layout?: "row" | "stack"
}

function FeatureItem({
  title,
  description,
  color,
  iconSize,
  layout = "row",
  className,
  ...props
}: FeatureItemProps) {
  const stack = layout === "stack"

  return (
    <div
      className={cn(
        stack
          ? "flex flex-col items-center gap-3 text-center"
          : "flex items-start gap-2.5 sm:gap-3.5",
        className
      )}
      {...props}
    >
      <BalloonClusterIcon color={color} size={iconSize ?? (stack ? 72 : 44)} />
      <div>
        <div
          className={cn(
            stack
              ? "font-heading text-[20px] font-black text-brand-plum"
              : "text-[15px] font-extrabold text-foreground sm:text-[17px]"
          )}
        >
          {title}
        </div>
        {description && (
          <div
            className={cn(
              stack
                ? "mt-2 text-[17px] leading-relaxed text-brand-ink-soft"
                : "mt-0.5 text-[13px] text-muted-foreground sm:mt-1 sm:text-sm"
            )}
          >
            {description}
          </div>
        )}
      </div>
    </div>
  )
}

export { FeatureItem }
