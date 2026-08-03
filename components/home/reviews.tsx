import { useTranslations } from "next-intl"

import { Panel } from "@/components/brand/panel"
import { Photo } from "@/components/brand/photo"
import { Reveal } from "@/components/brand/reveal"
import { ReviewCard } from "@/components/brand/review-card"
import { type ReviewContent } from "@/lib/home-config"

const REVIEW_PHOTOS = [
  "/assets/gallery/gallery-4.png",
  "/assets/gallery/gallery-5.png",
  "/assets/gallery/gallery-6.png",
]

/** Testimonials — a playful editorial masonry of quotes, photos and blocks. */
function Reviews() {
  const t = useTranslations("reviews")
  const items = t.raw("items") as ReviewContent[]

  return (
    <section className="px-5 py-20 md:px-9 md:py-28">
      <Reveal className="mx-auto max-w-6xl columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
        <Panel
          tone="lavender"
          className="flex min-h-[180px] items-center justify-center text-center"
        >
          <h2 className="font-heading text-[clamp(28px,3vw,38px)] font-black">
            {t("title")}
          </h2>
        </Panel>

        <Photo
          src={REVIEW_PHOTOS[0]}
          alt="רגעים מהמתחם"
          className="aspect-[3/4] w-full border border-border"
        />

        <ReviewCard
          className="border border-border"
          text={items[0].text}
          name={items[0].name}
          initials={items[0].init}
          ago={items[0].ago}
        />

        <div
          aria-hidden="true"
          className="h-40 rounded-[26px] bg-brand-banana"
        />

        <ReviewCard
          className="border border-border"
          text={items[1].text}
          name={items[1].name}
          initials={items[1].init}
          ago={items[1].ago}
        />

        <Photo
          src={REVIEW_PHOTOS[1]}
          alt="חוגגים אצלנו"
          className="aspect-square w-full border border-border"
        />

        <ReviewCard
          className="border border-border"
          text={items[2].text}
          name={items[2].name}
          initials={items[2].init}
          ago={items[2].ago}
        />

        <Photo
          src={REVIEW_PHOTOS[2]}
          alt="בריכת הכדורים"
          className="aspect-[3/4] w-full border border-border"
        />

        <div aria-hidden="true" className="h-32 rounded-[26px] bg-brand-mint" />
      </Reveal>
    </section>
  )
}

export { Reviews }
