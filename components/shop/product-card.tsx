import { BalloonClusterIcon } from "@/components/brand/balloon-cluster-icon"
import { PillButton } from "@/components/brand/pill-button"

interface ProductCardProps {
  name: string
  /** Number of punches — drives the flower punch-spots. */
  entries: number
  /** e.g. "10 כניסות" — used as the punch grid's accessible label. */
  entriesLabel: string
  /** Marketing line, e.g. "רק 32.5 ₪ לכניסה!". */
  perEntryLabel: string
  /** Formatted price, e.g. "350 ₪". */
  price: string
  /** Highlight this package as the popular choice. */
  featured: boolean
  /** Badge text for the featured card, e.g. "הבחירה הפופולרית". */
  popularLabel: string
  buyLabel: string
  /** Checkout link for this product. */
  href: string
}

/**
 * A punch-card package in the shop, styled as a minimal postage stamp: a white
 * card with a perforated (scalloped) purple edge and a row of flower punch-marks
 * — the first few already stamped, in order. Each mark "punches" (shrinks +
 * fades) when hovered or tapped. The per-entry line sits under the price to make
 * the deal read cheaper. Dumb component; the page passes plain strings.
 */
function ProductCard({
  name,
  entries,
  entriesLabel,
  perEntryLabel,
  price,
  featured,
  popularLabel,
  buyLabel,
  href,
}: ProductCardProps) {
  // Chronological: the first ~20% of marks are already stamped, in order.
  const usedCount = Math.round(entries * 0.2)

  return (
    <div className="relative h-full">
      {featured && (
        <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-[13px] font-black whitespace-nowrap text-white">
          {popularLabel}
        </span>
      )}

      {/* Two-layer stamp: a purple stamp whose padding shows as a solid
          perforated frame around the white inner card. */}
      <div className="stamp-edge h-full bg-accent p-[3px]">
        <div className="stamp-edge flex h-full flex-col items-center bg-white p-8 text-center">
          <h3 className="font-heading text-[22px] font-black text-brand-plum">
            {name}
          </h3>

          <div
            className="mt-5 flex flex-wrap justify-center gap-1.5"
            aria-label={entriesLabel}
          >
            {Array.from({ length: entries }, (_, index) => {
              const stamped = index < usedCount
              return (
                <BalloonClusterIcon
                  key={index}
                  color="var(--brand-lavender)"
                  size={26}
                  solidCenter={!stamped}
                  className="transition duration-200 hover:scale-90 hover:opacity-60 active:scale-90 active:opacity-60"
                />
              )
            })}
          </div>

          {/* Price + CTA sit as one block pushed to the bottom, so the price
              and button line up across every card regardless of flower count. */}
          <div className="mt-auto w-full pt-6">
            <p className="font-heading text-[34px] font-black text-brand-plum">
              {price}
            </p>
            <p className="text-[14px] font-bold text-accent">{perEntryLabel}</p>
            <PillButton href={href} size="md" className="mt-5 w-full">
              {buyLabel}
            </PillButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export { ProductCard }
