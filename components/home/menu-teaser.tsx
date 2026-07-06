import Image from "next/image"

import { Icon } from "@/components/brand/icon"
import { PillButton } from "@/components/brand/pill-button"
import { MENU_TEASER_TILES } from "@/lib/site-content"

/** Home teaser linking to the full menu, with a grid of category tiles. */
function MenuTeaser() {
  return (
    <section className="bg-brand-cream bg-[url('/assets/bg-cream-rainbow.png')] bg-cover bg-center px-5 py-16 md:px-9">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-10 md:flex-row md:items-center md:justify-between">
        <div className="max-w-lg">
          <h2 className="mb-4 font-heading text-[32px] font-black text-brand-brown">
            המזנון שלנו
          </h2>
          <p className="mb-6 text-[20px] leading-relaxed text-[#6b5f60]">
            כשהילדים משחקים — גם ההורים נהנים. יש לנו מזנון ביתי עם אוכל חם, קפה
            איכותי, מתוקים ואפילו בירה קרה לגדולים.
          </p>
          <PillButton href="/menu" size="md" className="hidden md:inline-flex">
            לתפריט המלא
            <Icon name="arrow-left" className="size-4" />
          </PillButton>
        </div>
        <div className="flex flex-col items-center gap-6 md:items-end">
          <div className="grid grid-cols-3 gap-3">
            {MENU_TEASER_TILES.map((tile) => (
              <div
                key={tile.label}
                className="flex size-32 flex-col items-center justify-center gap-2 p-2 text-center"
              >
                <Image
                  src={tile.image}
                  alt={tile.label}
                  width={80}
                  height={80}
                  className="size-20 object-contain"
                />
                <div className="text-[13px] leading-tight font-bold text-brand-brown">
                  {tile.label}
                </div>
              </div>
            ))}
          </div>
          <PillButton href="/menu" size="md" className="md:hidden">
            לתפריט המלא
            <Icon name="arrow-left" className="size-4" />
          </PillButton>
        </div>
      </div>
    </section>
  )
}

export { MenuTeaser }
