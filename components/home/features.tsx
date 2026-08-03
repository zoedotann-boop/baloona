import { useTranslations } from "next-intl"

import { FeatureItem } from "@/components/brand/feature-item"
import { PillButton } from "@/components/brand/pill-button"
import { Reveal } from "@/components/brand/reveal"
import { FEATURE_COLORS, type FeatureContent } from "@/lib/home-config"
import { whatsappLink } from "@/lib/site-content"

/** Three flowing feature columns with balloon icons, plus a pill CTA. */
function Features() {
  const t = useTranslations("features")
  const items = t.raw("items") as FeatureContent[]

  return (
    <section className="bg-white px-5 py-20 md:px-9 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-3 md:gap-10">
          {items.map((item, index) => (
            <Reveal key={item.title} delay={index * 90}>
              <FeatureItem
                layout="stack"
                title={item.title}
                description={item.description}
                color={FEATURE_COLORS[index % FEATURE_COLORS.length]}
              />
            </Reveal>
          ))}
        </div>
        <Reveal delay={280} className="mt-14 text-center">
          <PillButton
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("cta")}
          </PillButton>
        </Reveal>
      </div>
    </section>
  )
}

export { Features }
