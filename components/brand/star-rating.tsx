import { cn } from "@/lib/utils"

interface StarRatingProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of filled stars out of `max`. */
  rating?: number
  max?: number
}

/** Row of stars in the brand yellow. */
function StarRating({
  rating = 5,
  max = 5,
  className,
  ...props
}: StarRatingProps) {
  return (
    <div
      className={cn("text-[15px] tracking-[3px] text-brand-yellow", className)}
      role="img"
      aria-label={`${rating} מתוך ${max} כוכבים`}
      {...props}
    >
      {"★".repeat(Math.max(0, Math.min(rating, max)))}
      <span className="text-brand-pink">
        {"★".repeat(Math.max(0, max - rating))}
      </span>
    </div>
  )
}

export { StarRating }
