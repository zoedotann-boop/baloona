import { useTranslations } from "next-intl"

import { ReviewCard } from "@/components/brand/review-card"
import { type ReviewContent } from "@/lib/home-config"

/** Family testimonials on the blue splash section. */
function Reviews() {
  const t = useTranslations("reviews")
  const items = t.raw("items") as ReviewContent[]

  return (
    <section className="bg-primary px-5 py-14 md:px-9">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-6 font-heading text-[32px] font-black text-brand-cream">
          {t("title")}
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {items.map((review) => (
            <ReviewCard
              key={review.name}
              text={review.text}
              name={review.name}
              initials={review.init}
              ago={review.ago}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export { Reviews }
