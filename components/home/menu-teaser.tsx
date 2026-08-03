import { BalloonClusterIcon } from "@/components/brand/balloon-cluster-icon"
import { PillButton } from "@/components/brand/pill-button"
import { Reveal } from "@/components/brand/reveal"
import { MENU_TEASER_TILES } from "@/lib/site-content"

// Flower petal colors, cycled across the categories.
const CATEGORY_COLORS = [
  "var(--brand-lavender)",
  "var(--brand-rose)",
  "var(--brand-mint)",
  "var(--brand-flower-pink)",
  "var(--brand-gold)",
  "var(--brand-plum)",
]

/** Home teaser linking to the full menu, with flower category icons. */
function MenuTeaser() {
  return (
    <section className="bg-brand-cloud px-5 py-20 md:px-9 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <Reveal>
          <h2 className="mb-4 font-heading text-[38px] font-black text-brand-plum">
            המזנון שלנו
          </h2>
          <p className="mb-7 text-[19px] leading-[1.9] text-brand-ink-soft">
            כשהילדים משחקים — גם ההורים נהנים. יש לנו מזנון ביתי עם אוכל חם, קפה
            איכותי, מתוקים ואפילו בירה קרה לגדולים.
          </p>
          <PillButton href="/menu">לתפריט המלא ←</PillButton>
        </Reveal>

        <Reveal delay={100}>
          <div className="grid grid-cols-3 gap-x-4 gap-y-8">
            {MENU_TEASER_TILES.map((tile, index) => (
              <div
                key={tile.label}
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
