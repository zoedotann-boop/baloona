import { Icon } from "@/components/brand/icon"
import { IconTile } from "@/components/brand/icon-tile"
import { PillButton } from "@/components/brand/pill-button"
import { MENU_TEASER_TILES } from "@/lib/site-content"

const TONES = ["pink", "sky", "cream", "coral", "soft", "pink"] as const

/** Home teaser linking to the full menu, with a grid of category tiles. */
function MenuTeaser() {
  return (
    <section className="bg-brand-cream px-5 py-16 md:px-9">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-10 md:flex-row md:items-center md:justify-between">
        <div className="max-w-lg">
          <h2 className="mb-4 font-heading text-[32px] font-black text-brand-brown">
            המזנון שלנו
          </h2>
          <p className="mb-6 text-[15px] leading-relaxed text-[#6b5f60]">
            כשהילדים משחקים — גם ההורים נהנים. יש לנו מזנון ביתי עם אוכל חם, קפה
            איכותי, מתוקים ואפילו בירה קרה לגדולים.
          </p>
          <PillButton href="/menu" size="md">
            לתפריט המלא
            <Icon name="arrow-left" className="size-4" />
          </PillButton>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {MENU_TEASER_TILES.map((tile, i) => (
            <div
              key={tile.label}
              className="flex size-28 flex-col items-center justify-center gap-2 rounded-[20px] bg-white p-2 text-center shadow-[0_10px_28px_-18px_rgba(90,39,64,0.4)]"
            >
              <IconTile icon={tile.icon} tone={TONES[i]} size="sm" />
              <div className="text-[11px] leading-tight font-bold text-brand-brown">
                {tile.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { MenuTeaser }
