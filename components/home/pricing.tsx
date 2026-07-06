import { useTranslations } from "next-intl"

import { PriceCard } from "@/components/brand/price-card"
import { SectionEyebrow } from "@/components/brand/section-eyebrow"
import { type PriceContent } from "@/lib/home-config"

/** Entry pricing tiers. */
function Pricing() {
  const t = useTranslations("pricing")
  const items = t.raw("items") as PriceContent[]

  return (
    <section className="bg-white px-5 py-14 md:px-9">
      <div className="mx-auto max-w-6xl">
        <SectionEyebrow>{t("eyebrow")}</SectionEyebrow>
        <h2 className="mt-1.5 mb-6 font-heading text-[34px] font-black text-brand-brown">
          {t("title")}
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {items.map((item) => (
            <PriceCard
              key={item.title}
              sub={item.sub}
              title={item.title}
              rows={item.rows}
              featured={item.featured}
              popularLabel={t("popular")}
            />
          ))}
        </div>
        <p className="mt-4 text-[13px] text-destructive">{t("note")}</p>
      </div>
    </section>
  )
}

export { Pricing }
