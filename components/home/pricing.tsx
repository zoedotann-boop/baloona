import { useTranslations } from "next-intl"

import { Panel } from "@/components/brand/panel"
import { Reveal } from "@/components/brand/reveal"
import { Section } from "@/components/layout/section"
import type { HoursRow } from "@/lib/view-models"

interface PriceTierContent {
  id: string
  subtitle: string
  title: string
  rows: { id: string; label: string; price: string }[]
}

interface PricingProps {
  title: string
  tiers: PriceTierContent[]
  hours: HoursRow[]
  rules: string[]
  note: string
}

/** Pricing as a single flowing lavender panel — everything visible, docs-like. */
function Pricing({ title, tiers, hours, rules, note }: PricingProps) {
  const t = useTranslations("pricing")

  return (
    <Section id="pricing" className="scroll-mt-20 bg-white">
      <Reveal className="mx-auto max-w-3xl">
        <Panel tone="lavender" className="text-center">
          <h2 className="font-heading text-[clamp(32px,4.5vw,46px)] font-black">
            {title}
          </h2>

          {/* Prices — flowing lines, one block per tier */}
          <div className="mt-8 space-y-7">
            {tiers.map((tier) => (
              <div key={tier.id}>
                <div className="font-heading text-[17px] font-bold text-white/85">
                  {tier.subtitle} · {tier.title}
                </div>
                <div className="mx-auto mt-2 max-w-xs space-y-1.5">
                  {tier.rows.map((row) => (
                    <div
                      key={row.id}
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
              {hours.map((row) => (
                <div key={row.days}>
                  {row.days} · {row.time}
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
            <p className="mt-4 text-[14px] text-white/70">{note}</p>
          </div>
        </Panel>
      </Reveal>
    </Section>
  )
}

export { Pricing }
