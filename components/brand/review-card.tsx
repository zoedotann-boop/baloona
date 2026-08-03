import { StarRating } from "@/components/brand/star-rating"
import { cn } from "@/lib/utils"

interface ReviewCardProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string
  name: string
  /** Initial(s) shown in the avatar circle. */
  initials: string
  ago: string
  rating?: number
}

/** Family testimonial card — star rating, quote and an avatar footer. */
function ReviewCard({
  text,
  name,
  initials,
  ago,
  rating = 5,
  className,
  ...props
}: ReviewCardProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-[26px] bg-brand-cloud p-6",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <span
          className="size-3.5 rotate-[-8deg] bg-brand-flower-pink"
          style={{
            clipPath:
              "polygon(50% 100%,12% 58%,0 33%,13% 10%,35% 10%,50% 28%,65% 10%,87% 10%,100% 33%,88% 58%)",
          }}
        />
        <StarRating rating={rating} />
      </div>
      <p className="my-4 flex-1 text-base leading-relaxed text-foreground">
        “{text}”
      </p>
      <div className="mt-auto flex items-center gap-3 border-t border-border pt-4">
        <div className="flex size-10 items-center justify-center rounded-full bg-brand-pink font-heading text-sm font-extrabold text-secondary-foreground">
          {initials}
        </div>
        <div>
          <div className="text-[15px] font-bold text-foreground">{name}</div>
          <div className="text-[13px] text-muted-foreground">{ago}</div>
        </div>
      </div>
    </div>
  )
}

export { ReviewCard }
