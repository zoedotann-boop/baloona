"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { Menu, X } from "lucide-react"
import { useEffect, useState } from "react"

import { LanguageSwitcher } from "@/components/brand/language-switcher"
import { Logo } from "@/components/brand/logo"
import { PillButton } from "@/components/brand/pill-button"
import { StatusBadge } from "@/components/brand/status-badge"
import { NAV_LINKS, whatsappLink } from "@/lib/site-content"
import { cn } from "@/lib/utils"

/** Sticky top bar: wordmark, primary nav, open-now status and CTAs. */
function SiteHeader() {
  const t = useTranslations()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!menuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-40 flex h-[74px] items-center justify-between gap-6 border-b border-[#f4dbdf] bg-brand-cream px-5 md:px-9">
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        className="flex flex-col gap-1 md:hidden"
        aria-label={t("nav.menu")}
        aria-expanded={menuOpen}
        aria-controls="mobile-nav"
      >
        {menuOpen ? (
          <X className="size-6 text-foreground" />
        ) : (
          <Menu className="size-6 text-foreground" />
        )}
      </button>

      <Link href="/" aria-label={t("site.brand")}>
        <Logo size="md" />
      </Link>

      <nav className="hidden items-center gap-1.5 md:flex">
        {NAV_LINKS.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-10 items-center rounded-full px-[18px] text-sm",
                active
                  ? "bg-brand-pink font-extrabold text-foreground"
                  : "font-bold text-[#6b5f60] hover:bg-brand-pink/40"
              )}
            >
              {t(`nav.${item.key}`)}
            </Link>
          )
        })}
      </nav>

      <div className="flex items-center gap-3.5">
        <StatusBadge
          className="hidden lg:inline-flex"
          variant="inline"
          label={t("site.status")}
        />
        <PillButton
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          size="md"
          className="hidden h-10 px-[18px] text-[13px] md:inline-flex"
        >
          {t("site.whatsapp")}
        </PillButton>
        <LanguageSwitcher />
      </div>

      {/* Mobile navigation drawer */}
      {menuOpen && (
        <div className="fixed inset-0 top-[74px] z-30 md:hidden">
          <button
            type="button"
            aria-label={t("nav.menu")}
            tabIndex={-1}
            className="absolute inset-0 cursor-default bg-brand-brown/30 backdrop-blur-[2px]"
            onClick={() => setMenuOpen(false)}
          />
          <nav
            id="mobile-nav"
            className="relative flex flex-col gap-1 border-b border-[#f4dbdf] bg-brand-cream px-5 py-4 shadow-[0_20px_40px_-24px_rgba(90,52,43,0.5)]"
          >
            {NAV_LINKS.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex h-12 items-center rounded-2xl px-4 text-[15px]",
                    active
                      ? "bg-brand-pink font-extrabold text-foreground"
                      : "font-bold text-[#6b5f60] hover:bg-brand-pink/40"
                  )}
                >
                  {t(`nav.${item.key}`)}
                </Link>
              )
            })}
            <PillButton
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              size="md"
              className="mt-2 w-full"
            >
              {t("site.whatsapp")}
            </PillButton>
          </nav>
        </div>
      )}
    </header>
  )
}

export { SiteHeader }
