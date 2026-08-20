import { Reveal } from "@/components/brand/reveal"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"

interface BirthdayStepContent {
  id: string
  title: string
  subtitle: string
}

interface BirthdayStepsProps {
  title: string
  note: string
  steps: BirthdayStepContent[]
}

/** "How it works" — a flat numbered timeline of what every birthday includes. */
function BirthdaySteps({ title, note, steps }: BirthdayStepsProps) {
  if (steps.length === 0) return null

  return (
    <Section className="bg-brand-cloud">
      <Container size="md">
        <Reveal className="mb-14 text-center">
          <h2 className="font-heading text-[clamp(34px,4.5vw,48px)] font-black text-brand-plum">
            {title}
          </h2>
        </Reveal>

        <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connector line behind the numbers on wide screens. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-[12%] top-7 hidden h-0.5 bg-border lg:block"
          />
          {steps.map((step, index) => (
            <Reveal
              as="li"
              key={step.id}
              delay={index * 80}
              className="relative text-center"
            >
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent font-heading text-[22px] font-black text-accent-foreground">
                {index + 1}
              </div>
              <h3 className="mt-4 font-heading text-[20px] font-black text-brand-plum">
                {step.title}
              </h3>
              <p className="mt-2 text-[16px] leading-relaxed text-brand-ink-soft">
                {step.subtitle}
              </p>
            </Reveal>
          ))}
        </ol>

        {note && (
          <p className="mt-12 text-center text-[15px] leading-relaxed text-muted-foreground">
            {note}
          </p>
        )}
      </Container>
    </Section>
  )
}

export { BirthdaySteps }
