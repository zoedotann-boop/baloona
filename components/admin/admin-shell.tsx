"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  Building2,
  Cake,
  ExternalLink,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  Settings,
  Star,
  Tag,
  UtensilsCrossed,
  Users,
} from "lucide-react"

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
      ]
    : []

  const operationLinks = active
    ? [{ href: `/admin/${active.slug}/leads`, label: t("leads"), icon: Inbox }]
    : []

  const accountLinks = [
    ...(user.isOwner
      ? [
          { href: "/admin/locations", label: t("locations"), icon: Building2 },
          { href: "/admin/team", label: t("team"), icon: Users },
        ]
      : []),
  ]

  async function signOut() {
    await authClient.signOut()
    router.push(ADMIN_LOGIN_PATH)
    router.refresh()
  }

  return (
    // The shell owns the viewport: it never scrolls, so the sidebar stays put
    // and only the content column moves.
    <div className="flex h-svh overflow-hidden bg-brand-cloud">
      <aside className="hidden w-[264px] shrink-0 flex-col border-e border-border bg-white md:flex">
        <div className="border-b border-border px-4 py-2.5">
          <Logo size="sm" />
        </div>

        {locations.length > 0 && (
          <div className="border-b border-border p-3">
            <select
              value={active?.slug ?? ""}
              aria-label={t("locations")}
              onChange={(event) =>
                router.push(`/admin/${event.target.value}/general`)
              }
              className="h-10 w-full rounded-xl border border-border bg-white px-3 text-[14px] font-bold text-brand-plum focus:border-primary focus:outline-none"
            >
              {!active && <option value="">—</option>}
              {locations.map((location) => (
                <option key={location.slug} value={location.slug}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Compact enough that all ten links fit a 720p laptop without
            scrolling. `overflow-y-auto` is only a fallback for unusually short
            windows — it beats clipping links out of reach. */}
        <nav className="min-h-0 flex-1 overflow-y-auto px-2 py-1">
          <NavGroup
            label={t("sectionContent")}
            links={contentLinks}
            pathname={pathname}
          />
          <NavGroup
            label={t("sectionOperations")}
            links={operationLinks}
            pathname={pathname}
          />
          <NavGroup
            label={t("sectionAccount")}
            links={accountLinks}
            pathname={pathname}
          />
        </nav>

        <div className="border-t border-border p-2">
          {active && (
            <a
              href={`/${active.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 items-center gap-2.5 rounded-xl px-3 text-[14px] font-bold text-muted-foreground transition hover:bg-muted"
            >
              <ExternalLink className="size-4" />
              {t("viewSite")}
            </a>
          )}
          <button
            type="button"
            onClick={signOut}
            className="flex h-9 w-full items-center gap-2.5 rounded-xl px-3 text-start text-[14px] font-bold text-muted-foreground transition hover:bg-muted"
          >
            <LogOut className="size-4 shrink-0" />
            <span className="truncate text-brand-plum">{user.name}</span>
            <span className="ms-auto shrink-0">{t("signOut")}</span>
          </button>
        </div>
      </aside>

      {/* The only scroll container on the page. */}
      <div className="min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-6 py-8">{children}</div>
      </div>
    </div>
  )
}

/**
 * One section of the sidebar.
 *
 * The grouping is carried by a hairline rule and by each list's `aria-label`
 * rather than a visible heading: with ten links, three headings were the
 * difference between the nav fitting a 720p laptop and scrolling.
 */
function NavGroup({
  label,
  links,
  pathname,
}: {
  label: string
  links: { href: string; label: string; icon: React.ElementType }[]
  pathname: string
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
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex h-9 items-center gap-2.5 rounded-xl px-3 text-[14px] transition",
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
