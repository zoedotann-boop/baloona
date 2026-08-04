import { BalloonClusterIcon } from "@/components/brand/balloon-cluster-icon"
import { PillButton } from "@/components/brand/pill-button"
import { Reveal } from "@/components/brand/reveal"

// Flower petal colors, cycled across the categories.
const CATEGORY_COLORS = [
  "var(--brand-lavender)",
  "var(--brand-rose)",
  "var(--brand-mint)",
  "var(--brand-flower-pink)",
  "var(--brand-gold)",
  "var(--brand-plum)",
]

interface MenuTeaserProps {
  title: string
  body: string
  ctaLabel: string
  ctaHref: string
  tiles: { id: string; label: string }[]
}

/** Home teaser linking to the full menu, with flower category icons. */
function MenuTeaser({
  title,
  body,
  ctaLabel,
  ctaHref,
  tiles,
}: MenuTeaserProps) {
  return (
    <section className="bg-brand-cloud px-5 py-20 md:px-9 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <Reveal>
          <h2 className="mb-4 font-heading text-[38px] font-black text-brand-plum">
            {title}
          </h2>
          <p className="mb-7 text-[19px] leading-[1.9] text-brand-ink-soft">
            {body}
          </p>
          <PillButton href={ctaHref}>{ctaLabel} ←</PillButton>
        </Reveal>

        <Reveal delay={100}>
          <div className="grid grid-cols-3 gap-x-4 gap-y-8">
            {tiles.map((tile, index) => (
              <div
                key={tile.id}
                className="flex flex-col items-center gap-2.5 text-center"
              >
                <BalloonClusterIcon
                  color={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                  size={52}
                />
                <span className="text-[15px] font-bold text-brand-plum">
                  {tile.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export { MenuTeaser }
