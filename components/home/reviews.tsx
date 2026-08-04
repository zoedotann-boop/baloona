import { Fragment } from "react"

import { Panel } from "@/components/brand/panel"
import { Photo } from "@/components/brand/photo"
import { Reveal } from "@/components/brand/reveal"
import { ReviewCard } from "@/components/brand/review-card"

interface ReviewContent {
  id: string
  text: string
  name: string
  initials: string
  ago: string
  rating: number
}

interface ReviewsProps {
  title: string
  items: ReviewContent[]
  /** Venue photos woven between the quotes to break up the masonry. */
  photos: { url: string; alt: string }[]
}

const PHOTO_ASPECTS = ["aspect-[3/4]", "aspect-square"]

/**
 * Testimonials — a playful editorial masonry of quotes, photos and color
 * blocks. Every child is a direct child of the columns container so the
 * `break-inside-avoid` rule applies to each tile.
 */
function Reviews({ title, items, photos }: ReviewsProps) {
  if (items.length === 0) return null

  return (
    <section className="px-5 py-20 md:px-9 md:py-28">
      <Reveal className="mx-auto max-w-6xl columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
        <Panel
          tone="lavender"
          className="flex min-h-[180px] items-center justify-center text-center"
        >
          <h2 className="font-heading text-[clamp(28px,3vw,38px)] font-black">
            {title}
          </h2>
        </Panel>

        {items.map((review, index) => {
          const photo = photos[index % photos.length]
          return (
            <Fragment key={review.id}>
              {photo && (
                <Photo
                  src={photo.url}
                  alt={photo.alt}
                  className={`${PHOTO_ASPECTS[index % PHOTO_ASPECTS.length]} w-full border border-border`}
                />
              )}
              <ReviewCard
                className="border border-border"
                text={review.text}
                name={review.name}
                initials={review.initials}
                ago={review.ago}
                rating={review.rating}
              />
              {index === 0 && (
                <div
                  aria-hidden="true"
                  className="h-40 rounded-[26px] bg-brand-banana"
                />
              )}
            </Fragment>
          )
        })}

        <div aria-hidden="true" className="h-32 rounded-[26px] bg-brand-mint" />
      </Reveal>
    </section>
  )
}

export { Reviews }
