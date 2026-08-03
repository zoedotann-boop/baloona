import { useTranslations } from "next-intl"

import { AccentSquare } from "@/components/brand/accent-square"
import { Panel } from "@/components/brand/panel"
import { Photo } from "@/components/brand/photo"
import { Reveal } from "@/components/brand/reveal"

/** Vision — a lavender panel with flowing text beside a photo. */
function VisionPanel() {
  const t = useTranslations("about")

  return (
    <section className="px-5 py-20 md:px-9 md:py-28">
      <Panel
        tone="lavender"
        className="mx-auto grid max-w-6xl items-center gap-10 overflow-visible md:grid-cols-2"
      >
        <AccentSquare
          className="absolute -start-4 -top-5 -z-10"
          color="bg-brand-banana"
          rotate={-8}
        />
        <AccentSquare
          className="absolute -end-5 -bottom-6 -z-10"
          color="bg-brand-mint"
          rotate={10}
        />

        <Reveal>
          <h2 className="font-heading text-[clamp(30px,4vw,46px)] leading-[1.1] font-black">
            {t("title")}
          </h2>
          <p className="mt-6 text-[19px] leading-[1.9] text-white/90 md:text-[20px]">
            {t("body")}
          </p>
        </Reveal>

        <Reveal delay={100}>
          <Photo
            src="/assets/gallery/gallery-3.png"
            alt="המרחב המשותף של בלונה"
            className="aspect-[4/3] w-full"
          />
        </Reveal>
      </Panel>
    </section>
  )
}

export { VisionPanel }
