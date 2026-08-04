import { BirthdayScene } from "@/components/brand/birthday-scene"
import { Panel } from "@/components/brand/panel"
import { PillButton } from "@/components/brand/pill-button"
import { Reveal } from "@/components/brand/reveal"

interface BirthdayCtaProps {
  title: string
  description: string
  ctaLabel: string
  ctaHref: string
  imageUrl?: string
}

/** Lavender promo card for birthday party bookings. */
function BirthdayCta({
  title,
  description,
  ctaLabel,
  ctaHref,
  imageUrl,
}: BirthdayCtaProps) {
  return (
    <section className="px-5 py-20 md:px-9 md:py-28">
      <Panel
        tone="lavender"
        className="mx-auto grid max-w-6xl items-center gap-10 overflow-hidden md:grid-cols-2"
      >
        {/* The illustrated scene shows through when no photo is set. */}
        <div className="relative block h-[280px]">
          <BirthdayScene className="absolute inset-0 h-full w-full" />
          {imageUrl && (
            <div
              className="absolute inset-0 rounded-[26px] bg-cover bg-center"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
          )}
        </div>
        <Reveal>
          <h2 className="mb-4 font-heading text-[clamp(28px,4.5vw,46px)] leading-[1.12] font-black">
            {title}
          </h2>
          <p className="mb-7 text-[19px] leading-[1.9] text-white/90">
            {description}
          </p>
          <PillButton href={ctaHref} variant="soft">
            {ctaLabel} ←
          </PillButton>
        </Reveal>
      </Panel>
    </section>
  )
}

export { BirthdayCta }
