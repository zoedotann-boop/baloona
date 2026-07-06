import { useTranslations } from "next-intl"

import { FeatureItem } from "@/components/brand/feature-item"
import { FEATURE_COLORS, type FeatureContent } from "@/lib/home-config"

/** Four-up grid of headline amenities with balloon icons. */
function Features() {
  const t = useTranslations("features")
  const items = t.raw("items") as FeatureContent[]

  return (
    <section className="bg-white px-5 py-9 md:px-9">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <FeatureItem
            key={item.title}
            title={item.title}
            description={item.description}
            color={FEATURE_COLORS[index % FEATURE_COLORS.length]}
          />
        ))}
      </div>
    </section>
  )
}

export { Features }
