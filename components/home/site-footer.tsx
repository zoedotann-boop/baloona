import Link from "next/link"
import { useTranslations } from "next-intl"

import { Icon } from "@/components/brand/icon"
import { SectionEyebrow } from "@/components/brand/section-eyebrow"
import { BALOONA } from "@/lib/site-content"

const FOOTER_NAV = [
  { label: "ראשי", href: "/" },
  { label: "תפריט", href: "/menu" },
  { label: "ימי הולדת", href: "/birthdays" },
  { label: "מחירון", href: "/#pricing" },
  { label: "צרו קשר", href: "/#contact" },
]

const SOCIALS = ["instagram", "facebook", "tiktok"] as const

/** Site footer: brand blurb, navigation, contact details, hours and socials. */
function SiteFooter() {
  const t = useTranslations("footer")
  const site = useTranslations("site")

  return (
    <footer className="bg-brand-cream px-5 py-14 text-brand-sky-ink md:px-9">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 border-b border-brand-sky-ink/15 pb-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1fr]">
          <div>
            <div className="mb-3 font-heading text-2xl font-extrabold text-primary">
              {site("brand")}
            </div>
            <p className="text-[13px] leading-relaxed">{t("tagline")}</p>
          </div>

          <div>
            <SectionEyebrow className="mb-3 text-[#9ab0ec]">
              ניווט
            </SectionEyebrow>
            <ul className="space-y-1.5 text-[13px]">
              {FOOTER_NAV.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="transition hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionEyebrow className="mb-3 text-[#9ab0ec]">
              {t("contactTitle")}
            </SectionEyebrow>
            <ul className="space-y-2 text-[13px] leading-relaxed">
              <li className="flex items-start gap-2">
                <Icon
                  name="pin"
                  className="mt-0.5 size-4 shrink-0 opacity-60"
                />
                {BALOONA.address}
              </li>
              <li className="flex items-center gap-2">
                <Icon name="phone" className="size-4 shrink-0 opacity-60" />
                {BALOONA.phone}
              </li>
              <li className="flex items-center gap-2">
                <Icon name="mail" className="size-4 shrink-0 opacity-60" />
                {BALOONA.email}
              </li>
            </ul>
          </div>

          <div>
            <SectionEyebrow className="mb-3 text-[#9ab0ec]">
              {t("hoursTitle")}
            </SectionEyebrow>
            <div className="space-y-1 text-[13px]">
              <div>{t("hours.weekday")}</div>
              <div>{t("hours.friday")}</div>
              <div>{t("hours.saturday")}</div>
            </div>
            <div className="mt-4 flex gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={s}
                  className="flex size-9 items-center justify-center rounded-full bg-white text-brand-sky-ink transition hover:text-primary"
                >
                  <Icon name={s} className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-[11px] text-[#5e818c] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link
              href="/accessibility"
              className="underline hover:text-primary"
            >
              הצהרת נגישות
            </Link>
            <span>
              עוצב ופותח ע״י{" "}
              <a
                href="https://zoedotan.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline hover:text-primary"
              >
                Zoe Dotan
              </a>
            </span>
          </div>
          <span>{t("rights")}</span>
        </div>
      </div>
    </footer>
  )
}

export { SiteFooter }
