import { PillButton } from "@/components/brand/pill-button"

import { PunchCardArt, type PunchCardTheme } from "./punch-card-art"

interface ProductCardProps {
  name: string
  /** Marketing line, e.g. "רק 32.5 ₪ לכניסה!". */
  perEntryLabel: string
  /** Formatted price, e.g. "350 ₪". */
  price: string
  /** Highlight this package as the popular choice. */
  featured: boolean
  /** Badge text for the featured card, e.g. "הבחירה הפופולרית". */
  popularLabel: string
  buyLabel: string
  /** Which printed card design to show. */
  theme?: PunchCardTheme
  /** Decorative caption drawn on the card art, e.g. "כרטיסיית כניסה…". */
  cardCaption: string
  /** Checkout link for this product. */
  href: string
}

/**
 * A punch-card package in the shop: the illustrated Baloona entry card
 * ({@link PunchCardArt}, drawn as inline SVG) with the price and CTA on a frosted
 * footer. Dumb component; the page passes plain strings + the theme.
 */
function ProductCard({
  name,
  perEntryLabel,
  price,
  featured,
  popularLabel,
  buyLabel,
  theme = "age12",
  cardCaption,
  href,
}: ProductCardProps) {
  return (
    <div className="relative h-full">
      {featured && (
        <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-[13px] font-black whitespace-nowrap text-white">
          {popularLabel}
        </span>
      )}

      <div className="flex h-full flex-col overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-border">
        <PunchCardArt theme={theme} caption={cardCaption} />
        <div className="mt-auto px-6 py-5 text-center">
          <h3 className="font-heading text-[20px] font-black text-brand-plum">
            {name}
          </h3>
          <p className="mt-1 font-heading text-[30px] font-black text-brand-plum">
            {price}
          </p>
          <p className="text-[14px] font-bold text-accent">{perEntryLabel}</p>
          <PillButton href={href} size="md" className="mt-4 w-full">
            {buyLabel}
          </PillButton>
        </div>
      </div>
    </div>
  )
}

export { ProductCard }
