"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

import { AccentSquare } from "@/components/brand/accent-square"
import { Photo } from "@/components/brand/photo"
import { Reveal } from "@/components/brand/reveal"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { cn } from "@/lib/utils"

interface GalleryImage {
  id: string
  url: string
  alt: string
}

interface GalleryProps {
  title: string
  images: GalleryImage[]
}

/**
 * Venue photo gallery with a click-to-open lightbox.
 *
 * Two presentations share one image list: a swipeable snap-slider on mobile
 * (where a grid would shrink every tile to a thumbnail) and a featured mosaic
 * on desktop. Both open the same RTL-aware lightbox.
 */
function Gallery({ title, images }: GalleryProps) {
  const t = useTranslations("gallery")
  // Index of the image shown in the lightbox, or null when it is closed.
  const [active, setActive] = useState<number | null>(null)
  const isOpen = active !== null
  const total = images.length

  const close = useCallback(() => setActive(null), [])
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % total)),
    [total]
  )
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + total) % total)),
    [total]
  )

  // Keyboard controls + body scroll lock while the lightbox is open.
  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close()
      // RTL: right arrow → previous, left arrow → next.
      else if (e.key === "ArrowRight") prev()
      else if (e.key === "ArrowLeft") next()
    }
    window.addEventListener("keydown", onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, close, next, prev])

  // Physical swipe in the lightbox: drag left → next, drag right → previous.
  const touchStartX = useRef<number | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)()
    touchStartX.current = null
  }

  if (total === 0) return null

  return (
    <Section className="relative overflow-hidden bg-white">
      <AccentSquare
        className="absolute -end-6 top-24 -z-10"
        color="bg-brand-lavender"
        rotate={-10}
      />
      <Container>
        <Reveal className="mb-8 flex items-end justify-between">
          <h2 className="font-heading text-[clamp(32px,4vw,46px)] font-black text-brand-plum">
            {title}
          </h2>
        </Reveal>

        {/* Mobile: swipeable snap slider with a peek of the next photo. */}
        <Reveal className="md:hidden">
          <MobileSlider
            images={images}
            onOpen={setActive}
            openLabel={(index) => t("openImage", { index: index + 1 })}
            dotLabel={(index) => t("goToImage", { index: index + 1 })}
          />
        </Reveal>

        {/* Desktop: featured mosaic — the first photo leads at double size. */}
        <Reveal className="hidden auto-rows-[150px] grid-cols-3 gap-4 md:grid">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActive(index)}
              aria-label={t("openImage", { index: index + 1 })}
              className={cn(
                "group relative h-full cursor-zoom-in overflow-hidden rounded-[26px] outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                index === 0 && "col-span-2 row-span-2"
              )}
            >
              <Photo
                src={image.url}
                alt={image.alt}
                className="h-full transition-transform duration-300 group-hover:scale-[1.04]"
              />
            </button>
          ))}
        </Reveal>
      </Container>

      {isOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={t("dialog")}
          onClick={close}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button
            type="button"
            onClick={close}
            aria-label={t("close")}
            className="absolute end-4 top-4 flex size-11 items-center justify-center rounded-full bg-white/90 text-foreground transition hover:bg-white"
          >
            <X className="size-6" />
          </button>

          {/* RTL: previous sits on the right (start), next on the left (end). */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              prev()
            }}
            aria-label={t("previous")}
            className="absolute start-3 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground transition hover:bg-white md:start-6"
          >
            <ChevronRight className="size-7" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              next()
            }}
            aria-label={t("next")}
            className="absolute end-3 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground transition hover:bg-white md:end-6"
          >
            <ChevronLeft className="size-7" />
          </button>

          <div
            className="relative h-[70vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[active].url}
              alt={
                images[active].alt || t("imageOf", { index: active + 1, total })
              }
              fill
              sizes="90vw"
              className="rounded-[26px] object-contain"
              priority
            />
          </div>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-3.5 py-1 text-[15px] font-bold text-foreground">
            {t("counter", { index: active + 1, total })}
          </div>
        </div>
      )}
    </Section>
  )
}

/**
 * The mobile presentation: a horizontal scroll-snap track. Each slide is a bit
 * narrower than the viewport so the neighbouring photo peeks, signalling that
 * the row slides; the dots below track and jump between photos.
 */
function MobileSlider({
  images,
  onOpen,
  openLabel,
  dotLabel,
}: {
  images: GalleryImage[]
  onOpen: (index: number) => void
  openLabel: (index: number) => string
  dotLabel: (index: number) => string
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)

  // Derive the active slide from whichever tile is nearest the track's centre.
  // Reading geometry (not scrollLeft) keeps it correct under RTL scrolling.
  const syncCurrent = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const centre = track.getBoundingClientRect().left + track.clientWidth / 2
    let nearest = 0
    let nearestDistance = Infinity
    Array.from(track.children).forEach((child, index) => {
      const rect = (child as HTMLElement).getBoundingClientRect()
      const distance = Math.abs(rect.left + rect.width / 2 - centre)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearest = index
      }
    })
    setCurrent(nearest)
  }, [])

  const goTo = (index: number) => {
    const child = trackRef.current?.children[index] as HTMLElement | undefined
    child?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    })
  }

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={syncCurrent}
        className="-mx-5 flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto px-5 pb-1 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => onOpen(index)}
            aria-label={openLabel(index)}
            className="relative aspect-[4/3] w-[82%] shrink-0 cursor-zoom-in snap-center overflow-hidden rounded-[26px] outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Photo src={image.url} alt={image.alt} className="h-full" />
          </button>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => goTo(index)}
            aria-label={dotLabel(index)}
            aria-current={index === current}
            className={cn(
              "h-2 rounded-full transition-all",
              index === current
                ? "w-5 bg-primary"
                : "w-2 bg-brand-lavender/50 hover:bg-brand-lavender"
            )}
          />
        ))}
      </div>
    </div>
  )
}

export { Gallery }
