"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

import { AccentSquare } from "@/components/brand/accent-square"
import { Photo } from "@/components/brand/photo"
import { Reveal } from "@/components/brand/reveal"
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

/** Photo gallery grid of venue images with a click-to-open lightbox. */
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

  if (total === 0) return null

  return (
    <section className="relative overflow-hidden bg-white px-5 py-20 md:px-9 md:py-28">
      <AccentSquare
        className="absolute -end-6 top-24 -z-10"
        color="bg-brand-lavender"
        rotate={-10}
      />
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-8 flex items-end justify-between">
          <h2 className="font-heading text-[clamp(32px,4vw,46px)] font-black text-brand-plum">
            {title}
          </h2>
        </Reveal>
        <Reveal className="grid auto-rows-[106px] grid-cols-2 gap-4 md:grid-cols-4">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActive(index)}
              aria-label={t("openImage", { index: index + 1 })}
              className={cn(
                "group relative h-full cursor-zoom-in overflow-hidden rounded-[26px] outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                index === 0 && "col-span-2 row-span-2",
                index === total - 1 && "col-span-2 md:col-span-4"
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
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={t("dialog")}
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label={t("close")}
            className="absolute end-4 top-4 flex size-11 items-center justify-center rounded-full bg-white/90 text-foreground transition hover:bg-white"
          >
            <X className="size-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              prev()
            }}
            aria-label={t("previous")}
            className="absolute end-3 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground transition hover:bg-white md:end-6"
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
            className="absolute start-3 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground transition hover:bg-white md:start-6"
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
    </section>
  )
}

export { Gallery }
