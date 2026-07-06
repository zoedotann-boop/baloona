import { useTranslations } from "next-intl"

import { Logo } from "@/components/brand/logo"
import { PillButton } from "@/components/brand/pill-button"
import { StatusBadge } from "@/components/brand/status-badge"
import { cn } from "@/lib/utils"

const NAV_KEYS = ["home", "menu", "birthdays"] as const

/** Sticky top bar: wordmark, primary nav, open-now status and CTAs. */
function SiteHeader() {
  const t = useTranslations()

  return (
    <header className="sticky top-0 z-20 flex h-[74px] items-center justify-between gap-6 border-b border-[#f4dbdf] bg-brand-cream px-5 md:px-9">
      <button
        type="button"
        className="flex flex-col gap-1 md:hidden"
        aria-label={t("nav.menu")}
      >
        <span className="h-[2.5px] w-5 rounded-full bg-foreground" />
        <span className="h-[2.5px] w-5 rounded-full bg-foreground" />
        <span className="h-[2.5px] w-5 rounded-full bg-foreground" />
      </button>

      <Logo size="md" />

      <nav className="hidden items-center gap-1.5 md:flex">
        {NAV_KEYS.map((key, index) => (
          <a
            key={key}
            href="#"
            className={cn(
              "flex h-10 items-center rounded-full px-[18px] text-sm",
              index === 0
                ? "bg-brand-pink font-extrabold text-foreground"
                : "font-bold text-[#6b5f60] hover:bg-brand-pink/40"
            )}
          >
            {t(`nav.${key}`)}
          </a>
        ))}
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
