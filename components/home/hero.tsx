import Image from "next/image"
import { useTranslations } from "next-intl"

import { Logo } from "@/components/brand/logo"
import { PillButton } from "@/components/brand/pill-button"
import { StatusBadge } from "@/components/brand/status-badge"

// Playful bowling-ball accents that float around the hero.
const ACCENTS = [
  {
    src: "/assets/balls/pink.png",
    className: "left-[4%] top-10 w-20 md:w-28",
    delay: "0s",
  },
  {
    src: "/assets/balls/orange.png",
    className: "right-[5%] top-16 w-16 md:w-24",
    delay: "1.2s",
  },
  {
    src: "/assets/balls/cyan.png",
    className: "left-[9%] bottom-8 w-14 md:w-20",
    delay: "0.6s",
  },
]

/**
 * Centered hero — giant wordmark, headline, CTAs and opening hours.
 * Background uses the design's candy illustration at `/public/hero-bg.png`;
 * the brand pink shows through until that file is present.
 */
function Hero() {
  const t = useTranslations("hero")
  const site = useTranslations("site")

  return (
    <section className="relative overflow-hidden bg-brand-pink bg-[url('/hero-bg.png')] bg-cover bg-center px-5 py-16 text-center md:px-9 md:py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {ACCENTS.map((a) => (
          <Image
            key={a.src}
            src={a.src}
            alt=""
            width={140}
            height={140}
            style={{ animationDelay: a.delay }}
            className={`animate-baloona-float absolute h-auto ${a.className}`}
          />
        ))}
      </div>
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center">
        <StatusBadge className="mb-5" variant="pill" label={t("badge")} />
        <Logo size="hero" className="mb-2" />
        <h1 className="font-heading text-[clamp(28px,5vw,40px)] leading-[1.08] font-black tracking-[-1px] text-brand-brown">
          {t("title")}
        </h1>
        <p className="mt-5 max-w-[430px] text-[18px] leading-relaxed text-[#6b5f60]">
          {t("description")}
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <PillButton href="#">{t("waze")}</PillButton>
          <PillButton href="#" variant="outline">
            {site("whatsapp")}
          </PillButton>
        </div>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-4 text-[13px] font-semibold text-brand-muted">
          <span>{t("hours.weekday")}</span>
          <span className="opacity-40">·</span>
          <span>{t("hours.friday")}</span>
          <span className="opacity-40">·</span>
          <span>{t("hours.saturday")}</span>
        </div>
      </div>
    </section>
  )
}

export { Hero }
