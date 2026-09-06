import { Check, CreditCard, MapPin } from "lucide-react"

import { Reveal } from "@/components/brand/reveal"
import { SkyBackdrop } from "@/components/brand/sky-backdrop"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { ProductCard } from "@/components/shop/product-card"

interface ShopProduct {
  id: string
  name: string
  perEntryLabel: string
  price: string
  featured: boolean
  href: string
}

interface ShopSectionProps {
  title: string
  subtitle: string
  note: string
  paymentNote: string
  benefits: string[]
  popularLabel: string
  buyLabel: string
  cardCaptions: { age12: string; age2: string }
  products: ShopProduct[]
}

function ShopSection({
  title,
  subtitle,
  note,
  paymentNote,
  benefits,
  popularLabel,
  buyLabel,
  cardCaptions,
  products,
}: ShopSectionProps) {
  if (products.length === 0) return null

  return (
    <Section
      id="shop"
      className="relative isolate scroll-mt-20 overflow-hidden bg-[#eaf6fd]"
    >
      <SkyBackdrop />
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-[clamp(32px,4.5vw,46px)] font-black text-brand-plum">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-[17px] leading-relaxed text-brand-ink-soft">
            {subtitle}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-[14px] font-bold text-brand-plum">
              <MapPin className="size-4 text-accent" aria-hidden />
              {note}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-[14px] font-bold text-brand-plum">
              <CreditCard className="size-4 text-accent" aria-hidden />
              {paymentNote}
            </span>
          </div>
        </Reveal>

        <div className="mt-12 flex flex-wrap items-stretch justify-center gap-6">
          {products.map((product, index) => {
            const theme = index % 2 === 0 ? "age12" : "age2"
            return (
              <Reveal
                key={product.id}
                delay={index * 80}
                className="w-full max-w-[360px]"
              >
                <ProductCard
                  name={product.name}
                  perEntryLabel={product.perEntryLabel}
                  price={product.price}
                  featured={product.featured}
                  popularLabel={popularLabel}
                  buyLabel={buyLabel}
                  theme={theme}
                  cardCaption={cardCaptions[theme]}
                  href={product.href}
                />
              </Reveal>
            )
          })}
        </div>

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
