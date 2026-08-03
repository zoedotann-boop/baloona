import { Panel } from "@/components/brand/panel"
import { Reveal } from "@/components/brand/reveal"
import {
  BDAY_PACKAGE_LINES,
  BDAY_RULES,
  BDAY_UPGRADES,
} from "@/lib/site-content"

/** Birthday package: price, what's included, upgrades and important rules. */
function BirthdayPackage() {
  return (
    <section className="px-5 py-20 md:px-9 md:py-28">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <Panel tone="lavender" className="text-center">
            <div className="font-heading text-[18px] font-bold text-white/85">
              חבילת יום הולדת
            </div>
            <div className="mt-2 font-heading text-[64px] leading-none font-black">
              1,990
              <span className="text-[24px] font-bold opacity-70"> ₪</span>
            </div>
            <div className="mt-3 text-[19px] text-white/85">
              ל-25 ילדים · 49 ₪ לכל ילד נוסף
            </div>

            <div className="mt-8 border-t border-white/20 pt-7">
              <div className="font-heading text-[18px] font-bold text-white/85">
                מה כלול בחבילה
              </div>
              <ul className="mx-auto mt-4 max-w-md space-y-2.5 text-[19px] text-white/90">
                {BDAY_PACKAGE_LINES.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>

            <div className="mt-8 space-y-1 border-t border-white/20 pt-7 text-[17px] text-white/80">
              <div>מקדמה לשריון: 400 ₪ (תקוזז מהסכום הסופי)</div>
              <div>אח/בן משפחה נוסף חייב בכרטיס כניסה</div>
            </div>
          </Panel>
        </Reveal>

        <Reveal className="mt-16">
          <h2 className="text-center font-heading text-[clamp(32px,4.5vw,44px)] font-black text-brand-plum">
            תוספות ושדרוגים
          </h2>
          <div className="mx-auto mt-6 max-w-xl divide-y divide-border">
            {BDAY_UPGRADES.map((u) => (
              <div
                key={u.label}
                className="flex items-baseline justify-between gap-4 py-4"
              >
                <span className="text-[19px] font-bold text-foreground">
                  {u.label}
                </span>
                <span className="shrink-0 font-heading text-[19px] font-black text-brand-plum">
                  {u.price}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-16">
          <h2 className="text-center font-heading text-[clamp(32px,4.5vw,44px)] font-black text-brand-plum">
            חוקים חשובים
          </h2>
          <ul className="mx-auto mt-6 max-w-xl space-y-3 text-[19px] leading-relaxed text-foreground">
            {BDAY_RULES.map((rule) => (
              <li key={rule} className="flex items-start gap-3">
                <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-plum" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

export { BirthdayPackage }
