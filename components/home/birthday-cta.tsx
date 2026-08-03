import { useTranslations } from "next-intl"

import { BirthdayScene } from "@/components/brand/birthday-scene"
import { Panel } from "@/components/brand/panel"
import { PillButton } from "@/components/brand/pill-button"
import { Reveal } from "@/components/brand/reveal"

/** Lavender promo card for birthday party bookings. */
function BirthdayCta() {
  const t = useTranslations("birthday")

  return (
    <section className="px-5 py-20 md:px-9 md:py-28">
      <Panel
        tone="lavender"
        className="mx-auto grid max-w-6xl items-center gap-10 overflow-hidden md:grid-cols-2"
      >
        {/* Real venue photo at /public/birthday.png when present; the
            illustrated scene shows through as a fallback. */}
        <div className="relative block h-[280px]">
          <BirthdayScene className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 rounded-[26px] bg-[url('/birthday.png')] bg-cover bg-center" />
        </div>
        <Reveal>
          <h2 className="mb-4 font-heading text-[clamp(28px,4.5vw,46px)] leading-[1.12] font-black">
            {t("title")}
          </h2>
          <p className="mb-7 text-[19px] leading-[1.9] text-white/90">
            {t("description")}
          </p>
          <PillButton href="/birthdays" variant="soft">
            {t("cta")} ←
          </PillButton>
        </Reveal>
      </Panel>
    </section>
  )
}

export { BirthdayCta }
