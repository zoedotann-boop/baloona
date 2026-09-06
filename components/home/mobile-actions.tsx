"use client"

import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

import { Icon } from "@/components/brand/icon"
import { cn } from "@/lib/utils"

interface MobileActionsProps {
  whatsappHref: string
  isOpen: boolean
}

function MobileActions({ whatsappHref, isOpen }: MobileActionsProps) {
  const site = useTranslations("site")
  const status = useTranslations("status")
  const mobile = useTranslations("mobile")
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    function onScroll() {
      setShowTop(window.scrollY > 400)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="md:hidden">
      <div className="fixed bottom-6 left-4 z-50 flex flex-col items-center gap-3">
        <span
          className={cn(
            "relative flex size-14 flex-col items-center justify-center rounded-full px-1 text-center font-heading text-[11px] leading-tight font-black text-white ring-4 ring-white/70",
            isOpen ? "bg-brand-green" : "bg-red-500"
          )}
        >
          <span className="animate-baloona-pulse absolute top-2 size-[6px] rounded-full bg-white" />
          <span className="mt-2.5">
            {isOpen ? status("openShort") : status("closedShort")}
          </span>
        </span>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={site("whatsapp")}
          className="flex size-14 items-center justify-center rounded-full bg-brand-green text-white ring-4 ring-white/70 transition-transform active:translate-y-px active:scale-95"
        >
          <Icon name="whatsapp" className="size-7" />
        </a>

        <button
          type="button"
          onClick={scrollToTop}
          aria-label={mobile("backToTop")}
          aria-hidden={!showTop}
          tabIndex={showTop ? 0 : -1}
          className={cn(
            "flex size-14 items-center justify-center rounded-full bg-white text-foreground ring-4 ring-white/70 transition-all duration-300 active:translate-y-px active:scale-95",
            showTop
              ? "translate-y-0 scale-100 opacity-100"
              : "pointer-events-none translate-y-2 scale-90 opacity-0"
          )}
        >
          <Icon name="arrow-up" className="size-5" />
        </button>
      </div>
    </div>
  )
}

export { MobileActions }
