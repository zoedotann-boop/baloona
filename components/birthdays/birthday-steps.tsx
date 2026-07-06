import { StepCard } from "@/components/brand/step-card"
import { BDAY_STEPS } from "@/lib/site-content"

const TONES = ["pink", "sky", "cream", "coral"] as const

/** "How it works" — the four things included in every birthday. */
function BirthdaySteps() {
  return (
    <section className="bg-brand-cream px-5 py-16 md:px-9">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-9 font-heading text-[32px] font-black text-brand-brown">
          מה הלו״ז?
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BDAY_STEPS.map((s, i) => (
            <StepCard
              key={s.label}
              index={i + 1}
              icon={s.icon}
              title={s.label}
              sub={s.sub}
              tone={TONES[i]}
            />
          ))}
        </div>
        <p className="mt-6 text-[12px] leading-relaxed text-brand-muted">
          * במהלך כל האירוע מסופקים לילדים קנקני מים ופטל באופן חופשי, ללא עלות.
        </p>
      </div>
    </section>
  )
}

export { BirthdaySteps }
