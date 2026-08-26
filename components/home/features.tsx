import { FeatureItem } from "@/components/brand/feature-item"
import { PillButton } from "@/components/brand/pill-button"
import { Reveal } from "@/components/brand/reveal"
import { WallScene } from "@/components/brand/wall-scene"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { FEATURE_COLORS } from "@/lib/view-models"

interface FeatureContent {
  title: string
  description: string
}

interface FeaturesProps {
  items: FeatureContent[]
  ctaLabel: string
  ctaHref: string
}

/** Flowing feature columns with balloon icons, plus a pill CTA. */
function Features({ items, ctaLabel, ctaHref }: FeaturesProps) {
  return (
    <Section className="relative isolate overflow-hidden">
      <WallScene variant="windmill" />
      <Container>
        <div className="grid gap-12 md:grid-cols-3 md:gap-10">
          {items.map((item, index) => (
            <Reveal key={item.title} delay={index * 90}>
              <FeatureItem
                layout="stack"
                title={item.title}
                description={item.description}
                color={FEATURE_COLORS[index % FEATURE_COLORS.length]}
              />
            </Reveal>
          ))}
        </div>
        <Reveal delay={280} className="mt-14 text-center">
          <PillButton href={ctaHref} target="_blank" rel="noopener noreferrer">
            {ctaLabel}
          </PillButton>
        </Reveal>
      </Container>
    </Section>
  )
}

export { Features }
