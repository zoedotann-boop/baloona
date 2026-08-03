import { AccentSquare } from "@/components/brand/accent-square"
import { PillButton } from "@/components/brand/pill-button"
import { Photo } from "@/components/brand/photo"
import { Reveal } from "@/components/brand/reveal"

/** Birthdays page hero. */
function BirthdayHero() {
  return (
    <section className="px-5 py-20 md:px-9 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <Reveal>
          <h1 className="mb-5 font-heading text-[clamp(38px,5vw,56px)] leading-tight font-black text-brand-plum">
            חוגגים יום הולדת
            <br />
            בבלונה!
          </h1>
          <p className="mb-7 text-[19px] leading-[1.9] text-brand-ink-soft">
            שעתיים של כיף עם גישה חופשית למתקנים, חדר פרטי, פיצה לכל ילד וטקס
            עוגה ע״י צוות המקום.
          </p>
          <PillButton href="#lead-form">לשריון תאריך</PillButton>
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
            src="/assets/birthday-hero.png"
            alt="מתחם בלונה"
            objectPosition="bottom"
            className="h-80"
          />
        </Reveal>
      </div>
    </section>
  )
}

export { BirthdayHero }
