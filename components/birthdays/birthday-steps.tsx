import { SectionEyebrow } from "@/components/brand/section-eyebrow"
import { StepCard } from "@/components/brand/step-card"
import { BDAY_STEPS } from "@/lib/site-content"

/** "How it works" — the four things included in every birthday. */
function BirthdaySteps() {
  return (
    <section className="bg-[#fcecde] px-5 py-20 md:px-9">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <SectionEyebrow className="text-[#ff7d59]">
            ככה זה עובד
          </SectionEyebrow>
          <h2 className="mt-2 font-heading text-[clamp(30px,4vw,42px)] font-black text-brand-brown">
            מה הלו״ז?
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BDAY_STEPS.map((s, i) => (
            <StepCard
              key={s.label}
              index={i + 1}
              image={s.image}
              title={s.label}
              sub={s.sub}
            />
          ))}
        </div>
        <p className="mt-10 text-center text-[13px] leading-relaxed text-brand-muted">
          * במהלך כל האירוע מסופקים לילדים קנקני מים ופטל באופן חופשי, ללא עלות.
        </p>
      </div>
    </section>
  )
}

export { BirthdaySteps }
