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
import type { LocationPaths } from "@/lib/site-links"
import { cn } from "@/lib/utils"

interface SiteHeaderProps {
  /**
   * Per-branch links. Omitted on brand-global pages (branch picker, card,
   * checkout without a source branch), where the bar shrinks to just the
   * wordmark and language switcher.
   */
  paths?: LocationPaths
  whatsappHref?: string
  /** Rendered from the venue's real opening hours; omitted when unknown. */
  statusLabel?: string
  /** Drives the status dot colour (green open / red closed). */
  isOpen?: boolean
  /** Shown only when more than one branch is published. */
  showBranchSwitch?: boolean
}

/** Sticky top bar: wordmark, primary nav, open-now status and CTAs. */
function SiteHeader({
  paths,
  whatsappHref,
  statusLabel,
  isOpen = true,
  showBranchSwitch = false,
}: SiteHeaderProps) {
  const t = useTranslations()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = paths
    ? [
        { href: paths.home, label: t("nav.home") },
        { href: paths.menu, label: t("nav.menu") },
        { href: paths.birthdays, label: t("nav.birthdays") },
        { href: paths.shop, label: t("nav.shop") },
      ]
    : []
  const hasNav = navItems.length > 0

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
    <header className="sticky top-0 z-40 flex h-[74px] items-center justify-between gap-6 border-b border-border bg-white px-5 md:grid md:grid-cols-[1fr_auto_1fr] md:px-9">
      {hasNav && (
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex flex-col gap-1 md:hidden"
          aria-label={t("nav.toggle")}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
        >
          {menuOpen ? (
            <X className="size-6 text-foreground" />
          ) : (
            <Menu className="size-6 text-foreground" />
          )}
        </button>
      )}

      <Link
        href={paths?.home ?? "/"}
        aria-label={t("site.brand")}
        className="md:justify-self-start"
      >
        <Logo size="md" />
      </Link>

      {hasNav && (
        <nav className="hidden items-center gap-1.5 md:flex md:justify-self-center">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-10 items-center rounded-full px-[18px] text-base",
                  active
                    ? "bg-brand-pink font-extrabold text-brand-plum shadow-sm"
                    : "bg-brand-pink/70 font-bold text-brand-plum shadow-sm hover:bg-brand-pink"
                )}
              >
                {item.label}
              </Link>
            )
          })}
          {showBranchSwitch && (
            <Link
              href="/"
              className="flex h-10 items-center rounded-full bg-brand-pink/70 px-[18px] text-base font-bold text-brand-plum shadow-sm hover:bg-brand-pink"
            >
              {t("nav.allBranches")}
            </Link>
          )}
        </nav>
      )}

      <div className="flex items-center gap-3.5 md:justify-self-end">
        {statusLabel && (
          <StatusBadge
            className="hidden lg:inline-flex"
            variant="inline"
            label={statusLabel}
            isOpen={isOpen}
          />
        )}
        {whatsappHref && (
          <PillButton
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            size="md"
            className="hidden h-10 px-[18px] text-[15px] md:inline-flex"
          >
            {t("site.whatsapp")}
          </PillButton>
        )}
        <LanguageSwitcher />
      </div>

      {/* Mobile navigation drawer */}
      {menuOpen && (
        <div className="fixed inset-0 top-[74px] z-30 md:hidden">
          <button
            type="button"
            aria-label={t("announcement.close")}
            tabIndex={-1}
            className="absolute inset-0 cursor-default bg-foreground/30 backdrop-blur-[2px]"
            onClick={() => setMenuOpen(false)}
          />
          <nav
            id="mobile-nav"
            className="relative flex flex-col gap-1 border-b border-border bg-white px-5 py-4"
          >
            {navItems.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex h-12 items-center rounded-2xl px-4 text-[17px]",
                    active
                      ? "bg-brand-pink font-extrabold text-brand-plum shadow-sm"
                      : "bg-brand-pink/70 font-bold text-brand-plum shadow-sm hover:bg-brand-pink"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
            {showBranchSwitch && (
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="flex h-12 items-center rounded-2xl bg-brand-pink/70 px-4 text-[17px] font-bold text-brand-plum shadow-sm hover:bg-brand-pink"
              >
                {t("nav.allBranches")}
              </Link>
            )}
            {whatsappHref && (
              <PillButton
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                size="md"
                className="mt-2 w-full"
              >
                {t("site.whatsapp")}
              </PillButton>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

export { SiteHeader }
