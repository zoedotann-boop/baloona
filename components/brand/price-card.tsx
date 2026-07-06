import { cn } from "@/lib/utils"

interface PriceRow {
  label: string
  price: string
}

interface PriceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  sub: string
  title: string
  rows: PriceRow[]
  /** Adds the "most popular" badge (and a stronger shadow). */
  featured?: boolean
  /** Label for the "most popular" badge. */
  popularLabel?: string
  /** Surface treatment. Coral (default) matches the design; light is optional. */
  tone?: "coral" | "light"
}

/**
 * Pricing tier card. Coral-filled with cream text by default; the featured
 * tier additionally shows a gold "popular" badge.
 */
function PriceCard({
  sub,
  title,
  rows,
  featured = false,
  popularLabel,
  tone = "coral",
  className,
  ...props
}: PriceCardProps) {
  const coral = tone === "coral"

  return (
    <div
      className={cn(
        "relative rounded-[26px] p-7 transition-shadow",
        coral
          ? "bg-primary text-brand-cream"
          : "border border-[#f3d3d9] bg-white text-foreground",
        featured
          ? "shadow-[0_20px_48px_-18px_rgba(255,125,89,0.75)]"
          : coral && "shadow-[0_14px_36px_-22px_rgba(90,39,64,0.5)]",
        className
      )}
      {...props}
    >
      {featured && popularLabel && (
        <div className="absolute top-5 left-5 rounded-full bg-brand-gold px-3 py-1.5 font-heading text-[10px] font-extrabold tracking-[0.08em] text-white">
          {popularLabel}
        </div>
      )}
      <div
        className={cn(
          "font-heading text-[11px] font-extrabold tracking-[0.14em] uppercase",
          coral ? "text-brand-cream/75" : "text-primary"
        )}
      >
        {sub}
      </div>
      <div className="mt-1.5 font-heading text-[27px] font-black">{title}</div>
      <div
        className={cn(
          "mt-5 flex flex-col gap-3.5 border-t pt-4",
          coral ? "border-white/25" : "border-[#f1dde1]"
        )}
      >
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-sm">{row.label}</span>
            <span className="font-heading text-[21px] font-extrabold">
              {row.price}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { PriceCard }
export type { PriceRow }
