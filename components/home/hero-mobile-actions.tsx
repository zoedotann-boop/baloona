"use client"

import { useTranslations } from "next-intl"

import { Icon } from "@/components/brand/icon"
import { BALOONA } from "@/lib/site-content"

/**
 * Mobile-only floating controls for the hero: a small "open now" status button
 * plus WhatsApp and back-to-top buttons that stay in view while scrolling.
 */
function HeroMobileActions() {
  const site = useTranslations("site")

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="md:hidden">
      {/* Floating action buttons, styled to match the site's soft, rounded look */}
      <div className="fixed bottom-6 left-4 z-50 flex flex-col items-center gap-3">
        {/* "Open now" status chip */}
        <span className="relative flex size-12 flex-col items-center justify-center rounded-full bg-brand-green font-heading text-[9px] leading-tight font-black text-brand-cream shadow-[0_14px_28px_-10px_rgba(63,174,107,0.75)] ring-4 ring-white/70">
          <span className="animate-baloona-pulse absolute top-2 size-[6px] rounded-full bg-brand-cream" />
          <span className="mt-2.5">
            פתוח
            <br />
            כעת
          </span>
        </span>

        {/* WhatsApp — the primary action */}
        <a
          href={`https://wa.me/${BALOONA.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={site("whatsapp")}
          className="flex size-14 items-center justify-center rounded-full bg-brand-green text-brand-cream shadow-[0_16px_30px_-10px_rgba(63,174,107,0.8)] ring-4 ring-white/70 transition-transform active:translate-y-px active:scale-95"
        >
          <Icon name="whatsapp" className="size-7" />
        </a>

        {/* Back to top */}
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="חזרה למעלה"
          className="flex size-12 items-center justify-center rounded-full bg-brand-cream text-brand-brown shadow-[0_14px_30px_-12px_rgba(90,52,43,0.5)] ring-4 ring-white/70 transition-transform active:translate-y-px active:scale-95"
        >
          <Icon name="arrow-up" className="size-5" />
        </button>
      </div>
    </div>
  )
}

export { HeroMobileActions }
