import { useTranslations } from "next-intl"

import { AccentSquare } from "@/components/brand/accent-square"
import { PillButton } from "@/components/brand/pill-button"
import { Photo } from "@/components/brand/photo"
import { Reveal } from "@/components/brand/reveal"
import { WallScene } from "@/components/brand/wall-scene"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"

interface BirthdayHeroProps {
  title: string
  description: string
  imageUrl?: string
}

/** Birthdays page hero. */
function BirthdayHero({ title, description, imageUrl }: BirthdayHeroProps) {
  const t = useTranslations("birthdays")

  return (
    <Section className="relative isolate overflow-hidden">
      <WallScene variant="party" />
      <Container className="grid items-center gap-12 md:grid-cols-2">
        <Reveal>
          <h1 className="mb-5 font-heading text-[clamp(38px,5vw,56px)] leading-tight font-black text-brand-plum">
            {title}
          </h1>
          <p className="mb-7 text-[19px] leading-[1.9] text-brand-ink-soft">
            {description}
          </p>
          <PillButton href="#lead-form">{t("bookCta")}</PillButton>
        </Reveal>
        <Reveal delay={120} className="relative">
          <AccentSquare
            className="absolute -end-4 -top-5 -z-10"
            color="bg-brand-lavender"
            rotate={-8}
          />
          <AccentSquare
            className="absolute -start-5 -bottom-6 -z-10"
            color="bg-brand-banana"
            rotate={10}
          />
          <Photo
            src={imageUrl}
            alt={title}
            objectPosition="bottom"
            className="h-80"
          />
        </Reveal>
      </Container>
    </Section>
  )
}

export { BirthdayHero }
