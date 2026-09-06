import { useTranslations } from "next-intl"

import { Reveal } from "@/components/brand/reveal"
import { WallScene } from "@/components/brand/wall-scene"
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

/** Pricing as a single flowing block on the town wall scene — everything
 *  visible, docs-like, with dark ink over the painted backdrop. */
function Pricing({ title, tiers, hours, rules, note }: PricingProps) {
  const t = useTranslations("pricing")

  return (
    <Section
      id="pricing"
      className="relative isolate scroll-mt-20 overflow-hidden"
    >
      <WallScene variant="town" />
      <Reveal className="mx-auto max-w-3xl text-center">
        <h2 className="font-heading text-[clamp(32px,4.5vw,46px)] font-black text-brand-plum">
          {title}
        </h2>

        {/* Prices — flowing lines, one block per tier */}
        <div className="mt-8 space-y-7">
          {tiers.map((tier) => (
            <div key={tier.id}>
              <div className="font-heading text-[17px] font-bold text-brand-plum">
                {tier.subtitle} · {tier.title}
              </div>
              <div className="mx-auto mt-2 max-w-xs space-y-1.5">
                {tier.rows.map((row) => (
                  <div
                    key={row.id}
                    className="flex items-baseline justify-between gap-4 text-[17px] text-foreground"
                  >
                    <span>{row.label}</span>
                    <span className="font-heading font-black text-brand-plum">
                      {row.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Hours */}
        <div className="mt-9 border-t border-brand-plum/15 pt-7">
          <div className="font-heading text-[17px] font-bold text-brand-plum">
            {t("hoursTitle")}
          </div>
          <div className="mx-auto mt-2 max-w-xs space-y-1 text-[17px] text-foreground">
            {hours.map((row) => (
              <div key={row.days}>
                {row.days} · {row.time}
              </div>
            ))}
          </div>
        </div>

        {/* Rules */}
        <div className="mt-9 border-t border-brand-plum/15 pt-7">
          <div className="font-heading text-[17px] font-bold text-brand-plum">
            {t("rulesTitle")}
          </div>
          <ul className="mx-auto mt-3 max-w-md space-y-1.5 text-[15px] leading-relaxed text-brand-ink-soft">
            {rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
          <p className="mt-4 text-[14px] text-muted-foreground">{note}</p>
        </div>
      </Reveal>
    </Section>
  )
}

export { Pricing }
