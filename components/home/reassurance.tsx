import { PillButton } from "@/components/brand/pill-button"
import { Reveal } from "@/components/brand/reveal"
import { WallScene } from "@/components/brand/wall-scene"
import { Section } from "@/components/layout/section"

interface ReassuranceProps {
  title: string
  body: string
  ctaLabel: string
  ctaHref: string
}

/** "אל תדאגו, דאגנו לכם להכל!" — centered flowing reassurance over confetti. */
function Reassurance({ title, body, ctaLabel, ctaHref }: ReassuranceProps) {
  return (
    <Section spacing="xl" className="relative isolate overflow-hidden">
      <WallScene variant="market" />
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-[clamp(34px,5vw,52px)] leading-[1.15] font-black text-brand-plum">
          {title}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-[19px] leading-[1.9] text-brand-ink-soft md:text-[21px]">
          {body}
        </p>
        <div className="mt-9">
          <PillButton href={ctaHref} target="_blank" rel="noopener noreferrer">
            {ctaLabel}
          </PillButton>
        </div>
      </Reveal>
    </Section>
  )
}

export { Reassurance }
