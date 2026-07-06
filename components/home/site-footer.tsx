import { useTranslations } from "next-intl"

import { SectionEyebrow } from "@/components/brand/section-eyebrow"

/** Site footer: brand blurb, contact details and opening hours. */
function SiteFooter() {
  const t = useTranslations("footer")
  const site = useTranslations("site")

  return (
    <footer className="bg-brand-cream px-5 py-12 text-[#6b5f60] md:px-9">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 border-b border-brand-sky-ink/15 pb-7 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="mb-3 font-heading text-2xl font-extrabold text-primary">
              {site("brand")}
            </div>
            <p className="text-[13px] leading-relaxed text-brand-sky-ink">
              {t("tagline")}
            </p>
          </div>
          <div>
            <SectionEyebrow className="mb-3 text-[#9ab0ec]">
              {t("contactTitle")}
            </SectionEyebrow>
            <div className="text-[13px] leading-8 text-brand-sky-ink">
              {t("address")}
              <br />
              {t("phone")}
              <br />
              {t("email")}
            </div>
          </div>
          <div>
            <SectionEyebrow className="mb-3 text-[#9ab0ec]">
              {t("hoursTitle")}
            </SectionEyebrow>
            <div className="text-[13px] leading-8 text-brand-sky-ink">
              {t("hours.weekday")}
              <br />
              {t("hours.friday")}
              <br />
              {t("hours.saturday")}
            </div>
          </div>
        </div>
        <div className="pt-5 text-[11px] text-[#5e818c]">{t("rights")}</div>
      </div>
    </footer>
  )
}

export { SiteFooter }
