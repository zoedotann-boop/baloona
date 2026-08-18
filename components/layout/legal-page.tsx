import { Container } from "./container"
import { Section } from "./section"

interface LegalPageProps {
  title: string
  intro: string
  /** Optional line under the intro, e.g. the terms page's "last updated" date. */
  meta?: string
  children: React.ReactNode
}

/**
 * Shared template for the plain legal pages (accessibility statement, terms): a
 * lavender title band over a narrow prose column. Pages supply only the heading
 * copy and their body.
 */
function LegalPage({ title, intro, meta, children }: LegalPageProps) {
  return (
    <div className="bg-white">
      <Section
        spacing="none"
        className="bg-brand-lavender-soft py-16 text-center md:py-20"
      >
        <Container size="sm">
          <h1 className="font-heading text-[clamp(34px,5vw,52px)] leading-[1.08] font-black text-brand-plum">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-[520px] text-[17px] leading-relaxed text-brand-plum">
            {intro}
          </p>
          {meta && (
            <p className="mt-3 text-[14px] text-muted-foreground">{meta}</p>
          )}
        </Container>
      </Section>

      <Section spacing="sm">
        <Container size="sm">{children}</Container>
      </Section>
    </div>
  )
}

export { LegalPage }
