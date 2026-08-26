import { useTranslations } from "next-intl"

import { PillButton } from "@/components/brand/pill-button"
import { Photo } from "@/components/brand/photo"
import { Reveal } from "@/components/brand/reveal"
import { StatusBadge } from "@/components/brand/status-badge"
import { WallScene } from "@/components/brand/wall-scene"
import { HeroMobileActions } from "@/components/home/hero-mobile-actions"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import type { HoursRow } from "@/lib/view-models"

interface HeroProps {
  /** Live opening-status line (green/red dot). Omitted when hours are unknown. */
  statusLabel?: string
  title: string
  description: string
  /** Up to three photos: the first spans the mosaic's full width. */
  images: string[]
  wazeHref: string
  whatsappHref: string
  hours: HoursRow[]
  isOpen: boolean
}

/**
 * Editorial hero — an eyebrow, a big two-line headline, CTAs and hours on one
 * side, an asymmetric photo collage with accent squares on the other. Sits on a
 * soft-pink surface.
 */
function Hero({
  statusLabel,
  title,
  description,
  images,
  wazeHref,
  whatsappHref,
  hours,
  isOpen,
}: HeroProps) {
  const site = useTranslations("site")
  const [lead, ...rest] = images

  return (
    <Section
      spacing="md"
      className="relative isolate overflow-hidden bg-brand-pink-soft"
    >
      <WallScene variant="meadow" />
      <Container className="grid items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
        <Reveal>
          {statusLabel && (
            <StatusBadge
              className="mb-5"
              variant="pill"
              label={statusLabel}
              isOpen={isOpen}
            />
          )}
          <h1 className="max-w-[12ch] font-heading text-[clamp(36px,6vw,60px)] leading-[1.05] font-black tracking-[-1px] text-brand-plum">
            {title}
          </h1>
          <p className="mt-5 max-w-[460px] text-[19px] leading-[1.9] text-brand-ink-soft md:text-[20px]">
            {description}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <PillButton
              href={wazeHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              {site("waze")}
            </PillButton>
            <PillButton
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
            >
              {site("whatsapp")}
            </PillButton>
          </div>
          <div className="mt-8 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl bg-white px-5 py-3 text-[15px] font-semibold text-brand-ink-soft">
            {hours.map((row, index) => (
              <span key={row.days} className="flex items-center gap-x-3">
                {index > 0 && <span className="text-brand-rose">·</span>}
                <span>
                  {row.days} {row.time}
                </span>
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120} className="relative">
          {/* Playful photo mosaic. */}
          <div className="grid grid-cols-2 gap-3">
            <Photo
              src={lead}
              alt={title}
              className="col-span-2 aspect-[16/10] w-full rounded-[28px]"
            />
            {rest.slice(0, 2).map((src) => (
              <Photo
                key={src}
                src={src}
                alt=""
                className="aspect-square w-full rounded-[24px]"
              />
            ))}
          </div>
        </Reveal>
      </Container>
      <HeroMobileActions whatsappHref={whatsappHref} isOpen={isOpen} />
    </Section>
  )
}

export { Hero }
