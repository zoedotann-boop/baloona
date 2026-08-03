import { useTranslations } from "next-intl"

import { Panel } from "@/components/brand/panel"
import { Reveal } from "@/components/brand/reveal"
import { type PriceContent } from "@/lib/home-config"
import { BALOONA } from "@/lib/site-content"

/** Pricing as a single flowing lavender panel — everything visible, docs-like. */
function Pricing() {
  const t = useTranslations("pricing")
  const items = t.raw("items") as PriceContent[]
  const rules = t.raw("rules") as string[]

  return (
    <section
      id="pricing"
      className="scroll-mt-20 bg-white px-5 py-20 md:px-9 md:py-28"
    >
      <Reveal className="mx-auto max-w-3xl">
        <Panel tone="lavender" className="text-center">
          <h2 className="font-heading text-[clamp(32px,4.5vw,46px)] font-black">
            {t("title")}
          </h2>

          {/* Prices — flowing lines, one block per tier */}
          <div className="mt-8 space-y-7">
            {items.map((item) => (
              <div key={item.title}>
                <div className="font-heading text-[17px] font-bold text-white/85">
                  {item.sub} · {item.title}
                </div>
                <div className="mx-auto mt-2 max-w-xs space-y-1.5">
                  {item.rows.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-baseline justify-between gap-4 text-[17px] text-white/90"
                    >
                      <span>{row.label}</span>
                      <span className="font-heading font-black text-white">
                        {row.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Hours */}
          <div className="mt-9 border-t border-white/20 pt-7">
            <div className="font-heading text-[17px] font-bold text-white/85">
              {t("hoursTitle")}
            </div>
            <div className="mx-auto mt-2 max-w-xs space-y-1 text-[17px] text-white/90">
              {BALOONA.hours.map((h) => (
                <div key={h.days}>
                  {h.days} · {h.time}
                </div>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div className="mt-9 border-t border-white/20 pt-7">
            <div className="font-heading text-[17px] font-bold text-white/85">
              {t("rulesTitle")}
            </div>
            <ul className="mx-auto mt-3 max-w-md space-y-1.5 text-[15px] leading-relaxed text-white/80">
              {rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
            <p className="mt-4 text-[14px] text-white/70">{t("note")}</p>
          </div>
        </Panel>
      </Reveal>
    </section>
  )
}

export { Pricing }
