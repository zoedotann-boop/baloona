import { Check, MapPin } from "lucide-react"

import { Confetti } from "@/components/brand/confetti"
import { Reveal } from "@/components/brand/reveal"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { ProductCard } from "@/components/shop/product-card"

interface ShopProduct {
  id: string
  name: string
  entries: number
  entriesLabel: string
  perEntryLabel: string
  price: string
  featured: boolean
  /** Checkout link for this product. */
  href: string
}

interface ShopSectionProps {
  title: string
  subtitle: string
  /** Cross-branch validity note, e.g. "תקף בכל הסניפים". */
  note: string
  /** Selling points shown on every card. */
  benefits: string[]
  /** Badge for the featured package. */
  popularLabel: string
  buyLabel: string
  products: ShopProduct[]
}

/**
 * The punch cards, inlined into the home page: the packages a visitor can buy,
 * each linking to the global `/checkout`. Renders nothing when there are no
 * active products, so an empty catalog simply drops off the page. Sits on the
 * page background with a confetti scatter, matching the reassurance section.
 */
function ShopSection({
  title,
  subtitle,
  note,
  benefits,
  popularLabel,
  buyLabel,
  products,
}: ShopSectionProps) {
  if (products.length === 0) return null

  return (
    <Section id="shop" className="relative scroll-mt-20 overflow-hidden">
      <Confetti />
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-[clamp(32px,4.5vw,46px)] font-black text-brand-plum">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-[17px] leading-relaxed text-brand-ink-soft">
            {subtitle}
          </p>
          <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-[14px] font-bold text-brand-plum">
            <MapPin className="size-4 text-accent" aria-hidden />
            {note}
          </span>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <Reveal key={product.id} delay={index * 80}>
              <ProductCard
                name={product.name}
                entries={product.entries}
                entriesLabel={product.entriesLabel}
                perEntryLabel={product.perEntryLabel}
                price={product.price}
                featured={product.featured}
                popularLabel={popularLabel}
                buyLabel={buyLabel}
                href={product.href}
              />
            </Reveal>
          ))}
        </div>

        {/* Shared selling points — stated once for the whole shop, not per card. */}
        <Reveal>
          <ul className="mx-auto mt-12 flex max-w-4xl flex-col gap-3 sm:flex-row sm:justify-center sm:gap-8">
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start justify-center gap-2 text-[15px] leading-relaxed text-brand-ink-soft"
              >
                <Check
                  className="mt-0.5 size-4 shrink-0 text-accent"
                  aria-hidden
                />
                {benefit}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  )
}

export { ShopSection }
