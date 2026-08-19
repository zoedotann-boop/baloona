"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  Building2,
  Cake,
  ChevronDown,
  ExternalLink,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  ScrollText,
  Settings,
  ShoppingBag,
  Star,
  Tag,
  Ticket,
  UtensilsCrossed,
  Users,
  X,
} from "lucide-react"
import { useState } from "react"

import { ToastProvider } from "@/components/admin/toast"
import { Logo } from "@/components/brand/logo"
import { authClient } from "@/lib/auth-client"
import { ADMIN_LOGIN_PATH } from "@/lib/admin/routes"
import { cn } from "@/lib/utils"

interface AdminShellLocation {
  slug: string
  name: string
  isPublished: boolean
}

interface AdminShellProps {
  user: { name: string; isOwner: boolean }
  locations: AdminShellLocation[]
  children: React.ReactNode
}

/** Sidebar + content frame for every signed-in admin page. */
function AdminShell({ user, locations, children }: AdminShellProps) {
  const t = useTranslations("admin.nav")
  const pathname = usePathname()
  const router = useRouter()
  // The sidebar is a static column on desktop and a slide-in drawer on mobile.
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  // Branch-scoped routes are `/admin/<slug>/…`; owner pages are not. Reading it
  // from the path keeps the shell in the layout, above the `[location]` segment.
  const activeSlug = pathname.split("/")[2]
  const active = locations.find((location) => location.slug === activeSlug)

  const contentLinks = active
    ? [
        {
          href: `/admin/${active.slug}/general`,
          label: t("general"),
          icon: Settings,
        },
        {
          href: `/admin/${active.slug}/home`,
          label: t("home"),
          icon: LayoutDashboard,
        },
        {
          href: `/admin/${active.slug}/pricing`,
          label: t("pricing"),
          icon: Tag,
        },
        {
          href: `/admin/${active.slug}/menu`,
          label: t("menu"),
          icon: UtensilsCrossed,
        },
        {
          href: `/admin/${active.slug}/birthdays`,
          label: t("birthdays"),
          icon: Cake,
        },
        {
          href: `/admin/${active.slug}/media`,
          label: t("media"),
          icon: ImageIcon,
        },
        {
          href: `/admin/${active.slug}/reviews`,
          label: t("reviews"),
          icon: Star,
        },
        {
          href: `/admin/${active.slug}/shop`,
          label: t("shop"),
          icon: ShoppingBag,
        },
        {
          href: `/admin/${active.slug}/terms`,
          label: t("terms"),
          icon: ScrollText,
        },
      ]
    : []

  const operationLinks = active
    ? [
        {
          href: `/admin/${active.slug}/punch-cards`,
          label: t("punchCards"),
          icon: Ticket,
        },
      ]
    : []

  const accountLinks = user.isOwner
    ? [
        { href: "/admin/locations", label: t("locations"), icon: Building2 },
        { href: "/admin/team", label: t("team"), icon: Users },
      ]
    : []

  async function signOut() {
    close()
    await authClient.signOut()
    router.push(ADMIN_LOGIN_PATH)
    router.refresh()
  }

  return (
    // The shell owns the viewport: it never scrolls, so the sidebar stays put
    // and only the content column moves. It also hosts the toast region, so
    // every admin page can report a result without wiring its own.
    <ToastProvider>
      <div className="flex h-svh overflow-hidden bg-brand-cloud">
        {/* Mobile scrim behind the drawer. */}
        {open && (
          <div
            className="fixed inset-0 z-40 bg-foreground/40 md:hidden"
            onClick={close}
            aria-hidden
          />
        )}

        <aside
          className={cn(
            "fixed inset-y-0 right-0 z-50 flex w-[232px] shrink-0 flex-col border-e border-border bg-white transition-transform duration-200 md:static md:translate-x-0",
            open ? "translate-x-0" : "translate-x-full md:translate-x-0"
          )}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <Logo size="sm" />
            <button
              type="button"
              onClick={close}
              aria-label={t("closeMenu")}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted md:hidden"
            >
              <X className="size-5" />
            </button>
          </div>

          {locations.length > 0 && (
            <div className="border-b border-border p-2">
              <div className="relative">
                <select
                  value={active?.slug ?? ""}
                  aria-label={t("locations")}
                  onChange={(event) => {
                    close()
                    router.push(`/admin/${event.target.value}/general`)
                  }}
                  className="h-10 w-full appearance-none rounded-xl border border-border bg-white ps-3 pe-9 text-[14px] font-bold text-brand-plum focus:border-primary focus:outline-none"
                >
                  {!active && <option value="">—</option>}
                  {locations.map((location) => (
                    <option key={location.slug} value={location.slug}>
                      {location.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          )}

          <nav className="min-h-0 flex-1 overflow-y-auto px-2 py-1">
            <NavGroup
              label={t("sectionContent")}
              links={contentLinks}
              pathname={pathname}
              onNavigate={close}
            />
            <NavGroup
              label={t("sectionOperations")}
              links={operationLinks}
              pathname={pathname}
              onNavigate={close}
            />
            <NavGroup
              label={t("sectionAccount")}
              links={accountLinks}
              pathname={pathname}
              onNavigate={close}
            />
          </nav>

          <div className="border-t border-border p-2">
            {active && (
              <a
                href={`/${active.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 items-center gap-2.5 rounded-xl px-3 text-[13px] font-bold text-muted-foreground transition hover:bg-muted"
              >
                <ExternalLink className="size-4" />
                {t("viewSite")}
              </a>
            )}
            <button
              type="button"
              onClick={signOut}
              className="flex h-8 w-full items-center gap-2.5 rounded-xl px-3 text-start text-[13px] font-bold text-muted-foreground transition hover:bg-muted"
            >
              <LogOut className="size-4 shrink-0" />
              <span className="truncate text-brand-plum">{user.name}</span>
              <span className="ms-auto shrink-0">{t("signOut")}</span>
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile top bar — the only way to reach the nav on a phone. */}
          <div className="flex items-center justify-between border-b border-border bg-white px-4 py-2.5 md:hidden">
            <Logo size="sm" />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={t("openMenu")}
              className="flex size-9 items-center justify-center rounded-lg text-brand-plum transition hover:bg-muted"
            >
              <Menu className="size-5" />
            </button>
          </div>

          {/* The only scroll container on the page. */}
          <div className="min-w-0 flex-1 overflow-y-auto">
            <div className="mx-auto max-w-6xl px-4 py-4 md:px-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </ToastProvider>
  )
}

/** One section of the sidebar. */
function NavGroup({
  label,
  links,
  pathname,
  onNavigate,
}: {
  label: string
  links: { href: string; label: string; icon: React.ElementType }[]
  pathname: string
  onNavigate: () => void
}) {
  if (links.length === 0) return null
  return (
    <ul
      aria-label={label}
      className="space-y-0.5 border-border pt-2 not-first:mt-2 not-first:border-t"
    >
      {links.map((link) => {
        const isActive = pathname === link.href
        const Icon = link.icon
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex h-8 items-center gap-2.5 rounded-xl px-3 text-[13px] transition",
                isActive
                  ? "bg-brand-pink font-extrabold text-brand-plum"
                  : "font-bold text-muted-foreground hover:bg-muted"
              )}
            >
              <Icon className="size-4" />
              {link.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export { AdminShell }
