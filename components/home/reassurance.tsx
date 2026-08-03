import { useTranslations } from "next-intl"

import { Confetti } from "@/components/brand/confetti"
import { PillButton } from "@/components/brand/pill-button"
import { Reveal } from "@/components/brand/reveal"
import { whatsappLink } from "@/lib/site-content"

/** "אל תדאגו, דאגנו לכם להכל!" — centered flowing reassurance over confetti. */
function Reassurance() {
  const t = useTranslations("reassurance")

  return (
    <section className="relative overflow-hidden px-5 py-24 md:px-9 md:py-32">
      <Confetti />
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-[clamp(34px,5vw,52px)] leading-[1.15] font-black text-brand-plum">
          {t("title")}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-[19px] leading-[1.9] text-brand-ink-soft md:text-[21px]">
          {t("body")}
        </p>
        <div className="mt-9">
          <PillButton
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("cta")}
          </PillButton>
        </div>
      </Reveal>
    </section>
  )
}

export { Reassurance }
