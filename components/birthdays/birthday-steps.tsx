import { Reveal } from "@/components/brand/reveal"
import { BDAY_STEPS } from "@/lib/site-content"

/** "How it works" — a flat numbered timeline of what every birthday includes. */
function BirthdaySteps() {
  return (
    <section className="bg-brand-cloud px-5 py-20 md:px-9 md:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mb-14 text-center">
          <h2 className="font-heading text-[clamp(34px,4.5vw,48px)] font-black text-brand-plum">
            מה הלו״ז?
          </h2>
        </Reveal>

        <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connector line behind the numbers on wide screens. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-[12%] top-7 hidden h-0.5 bg-border lg:block"
          />
          {BDAY_STEPS.map((s, i) => (
            <Reveal
              as="li"
              key={s.label}
              delay={i * 80}
              className="relative text-center"
            >
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent font-heading text-[22px] font-black text-accent-foreground">
                {i + 1}
              </div>
              <h3 className="mt-4 font-heading text-[20px] font-black text-brand-plum">
                {s.label}
              </h3>
              <p className="mt-2 text-[16px] leading-relaxed text-brand-ink-soft">
                {s.sub}
              </p>
            </Reveal>
          ))}
        </ol>

        <p className="mt-12 text-center text-[15px] leading-relaxed text-muted-foreground">
          * במהלך כל האירוע מסופקים לילדים קנקני מים ופטל באופן חופשי, ללא עלות.
        </p>
      </div>
    </section>
  )
}

export { BirthdaySteps }
