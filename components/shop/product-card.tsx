import Image from "next/image"

import { PillButton } from "@/components/brand/pill-button"

type CardTheme = "age12" | "age2"

// The two printed Baloona entry cards, used as-is. Cards alternate between the
// pink "up to age 12" design and the blue "up to age 2" design across the grid.
const CARD_IMAGE: Record<CardTheme, string> = {
  age12: "/assets/shop/card-age12.png",
  age2: "/assets/shop/card-age2.png",
}

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
  theme?: CardTheme
  /** Checkout link for this product. */
  href: string
}

/**
 * A punch-card package in the shop: the actual printed Baloona entry card
 * (image, used as-is) with the price and CTA on a frosted footer. Dumb
 * component; the page passes plain strings + the theme.
 */
function ProductCard({
  name,
  perEntryLabel,
  price,
  featured,
  popularLabel,
  buyLabel,
  theme = "age12",
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
        <Image
          src={CARD_IMAGE[theme]}
          alt=""
          width={1196}
          height={2073}
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          className="w-full"
        />
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
