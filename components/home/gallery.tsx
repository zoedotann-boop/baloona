"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

import { Photo } from "@/components/brand/photo"
import { cn } from "@/lib/utils"

const GALLERY_IMAGES = [
  "/assets/gallery/gallery-1.png",
  "/assets/gallery/gallery-2.png",
  "/assets/gallery/gallery-3.png",
  "/assets/gallery/gallery-4.png",
  "/assets/gallery/gallery-5.png",
  "/assets/gallery/gallery-6.png",
]

/** Photo gallery grid of venue images with a click-to-open lightbox. */
function Gallery() {
  const t = useTranslations("gallery")
  // Index of the image shown in the lightbox, or null when it is closed.
  const [active, setActive] = useState<number | null>(null)
  const isOpen = active !== null

  const close = useCallback(() => setActive(null), [])
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % GALLERY_IMAGES.length)),
    []
  )
  const prev = useCallback(
    () =>
      setActive((i) =>
        i === null ? i : (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length
      ),
    []
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

  return (
    <section className="bg-white px-5 py-16 md:px-9">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-heading text-[32px] font-black text-brand-brown">
            {t("title")}
          </h2>
        </div>
        <div className="grid auto-rows-[106px] grid-cols-2 gap-3 md:grid-cols-4">
          {GALLERY_IMAGES.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`הגדלת תמונה ${index + 1}`}
              className={cn(
                "group relative h-full cursor-zoom-in overflow-hidden rounded-[26px] outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                index === 0 && "col-span-2 row-span-2",
                index === GALLERY_IMAGES.length - 1 &&
                  "col-span-2 md:col-span-4"
              )}
            >
              <Photo
                src={src}
                className="h-full transition-transform duration-300 group-hover:scale-[1.04]"
              />
            </button>
          ))}
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-brand-brown/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="גלריית תמונות"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="סגירה"
            className="absolute end-4 top-4 flex size-11 items-center justify-center rounded-full bg-white/90 text-brand-brown transition hover:bg-white"
          >
            <X className="size-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              prev()
            }}
            aria-label="הקודם"
            className="absolute end-3 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-brown transition hover:bg-white md:end-6"
          >
            <ChevronRight className="size-7" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              next()
            }}
            aria-label="הבא"
            className="absolute start-3 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-brown transition hover:bg-white md:start-6"
          >
            <ChevronLeft className="size-7" />
          </button>

          <div
            className="relative h-[70vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={GALLERY_IMAGES[active]}
              alt={`תמונה ${active + 1} מתוך ${GALLERY_IMAGES.length}`}
              fill
              sizes="90vw"
              className="rounded-[26px] object-contain"
              priority
            />
          </div>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-3.5 py-1 text-[13px] font-bold text-brand-brown">
            {active + 1} / {GALLERY_IMAGES.length}
          </div>
        </div>
      )}
    </section>
  )
}

export { Gallery }
