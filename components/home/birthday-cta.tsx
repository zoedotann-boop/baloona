import { useTranslations } from "next-intl"

import { BirthdayScene } from "@/components/brand/birthday-scene"
import { PillButton } from "@/components/brand/pill-button"
import { SectionEyebrow } from "@/components/brand/section-eyebrow"

/** Sky-blue promo card for birthday party bookings. */
function BirthdayCta() {
  const t = useTranslations("birthday")

  return (
    <section className="bg-white px-5 pt-6 pb-14 md:px-9">
      <div className="mx-auto grid max-w-6xl items-center gap-10 overflow-hidden rounded-[32px] bg-brand-sky p-8 md:grid-cols-2 md:p-12">
        {/* Real venue photo at /public/birthday.png when present; the
            illustrated scene shows through as a fallback. */}
        <div className="relative block h-[280px]">
          <BirthdayScene className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 rounded-[26px] bg-[url('/birthday.png')] bg-cover bg-center" />
        </div>
        <div>
          <SectionEyebrow className="text-brand-brown">
            {t("eyebrow")}
          </SectionEyebrow>
          <h2 className="mt-3 mb-4 font-heading text-[clamp(24px,4vw,40px)] leading-[1.12] font-black text-brand-brown">
            {t("title")}
          </h2>
          <p className="mb-7 text-[15px] leading-relaxed text-brand-sky-ink">
            {t("description")}
          </p>
          <PillButton href="/birthdays" variant="soft">
            {t("cta")} ←
          </PillButton>
        </div>
      </div>
    </section>
  )
}

export { BirthdayCta }
