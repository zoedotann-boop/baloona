import Link from "next/link"
import { getTranslations } from "next-intl/server"

import { Logo } from "@/components/brand/logo"

/**
 * Minimal shell for the brand-global store + legal pages (`/shop`, `/checkout`,
 * `/terms`). These are not tied to a branch, so they render on the bare root
 * layout rather than the per-location chrome — just a logo header and a slim
 * footer that keeps the Terms page reachable.
 */
export default async function StoreLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const t = await getTranslations("store")

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="border-b border-border bg-white px-5 py-3 md:px-9">
        <div className="mx-auto flex max-w-6xl items-center">
          <Link href="/" aria-label={t("backToSite")}>
            <Logo size="sm" />
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-brand-cloud px-5 py-6 text-center text-[13px] text-brand-plum md:px-9">
        <Link href="/terms" className="underline hover:text-foreground">
          {t("terms")}
        </Link>
      </footer>
    </div>
  )
}
