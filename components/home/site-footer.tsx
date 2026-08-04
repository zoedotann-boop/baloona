import Link from "next/link"
import { useTranslations } from "next-intl"

import { Icon } from "@/components/brand/icon"
import type { LocationPaths } from "@/lib/site-links"
import type { ContactDetails, HoursRow } from "@/lib/view-models"

interface SiteFooterProps {
  paths: LocationPaths
  tagline: string
  contact: ContactDetails
  hours: HoursRow[]
  year: number
}

/** Site footer: brand blurb, navigation, contact details, hours and socials. */
function SiteFooter({ paths, tagline, contact, hours, year }: SiteFooterProps) {
  const t = useTranslations("footer")
  const nav = useTranslations("nav")
  const site = useTranslations("site")

  const navLinks = [
    { label: nav("home"), href: paths.home },
    { label: nav("menu"), href: paths.menu },
    { label: nav("birthdays"), href: paths.birthdays },
    { label: t("pricingLink"), href: paths.pricing },
    { label: t("contactLink"), href: paths.contact },
  ]

  const socials = [
    { name: "instagram", href: contact.instagramUrl },
    { name: "facebook", href: contact.facebookUrl },
    { name: "tiktok", href: contact.tiktokUrl },
  ] as const

  return (
    <footer className="bg-brand-cloud px-5 py-14 text-brand-plum md:px-9">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 border-b border-brand-plum/15 pb-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1fr]">
          <div>
            <div className="mb-3 font-heading text-2xl font-extrabold text-brand-plum">
              {site("brand")}
            </div>
            <p className="text-[15px] leading-relaxed">{tagline}</p>
          </div>

          <div>
            <div className="mb-3 font-heading text-[15px] font-black text-brand-plum">
              {t("navTitle")}
            </div>
            <ul className="space-y-1.5 text-[15px]">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-3 font-heading text-[15px] font-black text-brand-plum">
              {t("contactTitle")}
            </div>
            <ul className="space-y-2 text-[15px] leading-relaxed">
              <li className="flex items-start gap-2">
                <Icon
                  name="pin"
                  className="mt-0.5 size-4 shrink-0 opacity-60"
                />
                {contact.address}
              </li>
              <li className="flex items-center gap-2">
                <Icon name="phone" className="size-4 shrink-0 opacity-60" />
                <a href={contact.telHref} className="hover:text-foreground">
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="mail" className="size-4 shrink-0 opacity-60" />
                <a href={contact.mailHref} className="hover:text-foreground">
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="mb-3 font-heading text-[15px] font-black text-brand-plum">
              {t("hoursTitle")}
            </div>
            <div className="space-y-1 text-[15px]">
              {hours.map((row) => (
                <div key={row.days}>
                  {row.days} · {row.time}
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              {socials.map(
                (social) =>
                  social.href && (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="flex size-9 items-center justify-center rounded-full bg-white text-brand-plum transition hover:text-foreground"
                    >
                      <Icon name={social.name} className="size-4" />
                    </a>
                  )
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-[13px] text-brand-plum sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link
              href={paths.accessibility}
              className="underline hover:text-foreground"
            >
              {t("accessibility")}
            </Link>
            <span>
              {t("credit")}{" "}
              <a
                href="https://zoedotan.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline hover:text-foreground"
              >
                Zoe Dotan
              </a>
            </span>
          </div>
          <span>{t("rights", { year })}</span>
        </div>
      </div>
    </footer>
  )
}

export { SiteFooter }
