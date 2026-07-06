"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { Menu } from "lucide-react"

import { Logo } from "@/components/brand/logo"
import { PillButton } from "@/components/brand/pill-button"
import { StatusBadge } from "@/components/brand/status-badge"
import { NAV_LINKS } from "@/lib/site-content"
import { cn } from "@/lib/utils"

/** Sticky top bar: wordmark, primary nav, open-now status and CTAs. */
function SiteHeader() {
  const t = useTranslations()
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-30 flex h-[74px] items-center justify-between gap-6 border-b border-[#f4dbdf] bg-brand-cream px-5 md:px-9">
      <button
        type="button"
        className="flex flex-col gap-1 md:hidden"
        aria-label={t("nav.menu")}
      >
        <Menu className="size-6 text-foreground" />
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
        <PillButton href="#" size="md" className="h-10 px-[18px] text-[13px]">
          {t("site.whatsapp")}
        </PillButton>
        <span className="hidden h-10 items-center gap-1.5 rounded-full bg-[#f7e7ea] px-3.5 text-xs font-extrabold text-[#7a3b4f] sm:flex">
          {t("site.langLabel")} ▾
        </span>
      </div>
    </header>
  )
}

export { SiteHeader }
