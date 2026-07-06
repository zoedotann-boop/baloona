import { PillButton } from "@/components/brand/pill-button"
import { Photo } from "@/components/brand/photo"
import { SectionEyebrow } from "@/components/brand/section-eyebrow"

/** Birthdays page hero. */
function BirthdayHero() {
  return (
    <section className="px-5 py-16 md:px-9">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div>
          <SectionEyebrow>ימי הולדת</SectionEyebrow>
          <h1 className="mt-2 mb-5 font-heading text-[clamp(32px,5vw,48px)] leading-tight font-black text-brand-brown">
            חוגגים יום הולדת
            <br />
            בבלונה!
          </h1>
          <p className="mb-7 text-[16px] leading-relaxed text-[#6b5f60]">
            שעתיים של כיף עם גישה חופשית למתקנים, חדר פרטי, פיצה לכל ילד וטקס
            עוגה ע״י צוות המקום.
          </p>
          <PillButton href="#lead-form">לשריון תאריך</PillButton>
        </div>
        <Photo
          src="/assets/birthday-hero.png"
          alt="מתחם בלונה"
          objectPosition="bottom"
          className="h-80"
        />
      </div>
    </section>
  )
}

export { BirthdayHero }
