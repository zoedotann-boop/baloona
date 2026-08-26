import { Heart, PartyBalloon } from "@/components/brand/motifs"
import { Panel } from "@/components/brand/panel"
import { Reveal } from "@/components/brand/reveal"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"

interface BirthdayUpgradeContent {
  id: string
  label: string
  price: string
}

interface BirthdayPackageProps {
  packageTitle: string
  price: string
  subtitle: string
  includedTitle: string
  includedLines: string[]
  depositNote: string
  upgradesTitle: string
  upgrades: BirthdayUpgradeContent[]
  rulesTitle: string
  rules: string[]
}

/** Birthday package: price, what's included, upgrades and important rules. */
function BirthdayPackage({
  packageTitle,
  price,
  subtitle,
  includedTitle,
  includedLines,
  depositNote,
  upgradesTitle,
  upgrades,
  rulesTitle,
  rules,
}: BirthdayPackageProps) {
  return (
    <Section className="relative overflow-hidden">
      {/* Party accents in the margins around the centered package card. */}
      <PartyBalloon
        aria-hidden
        color="var(--brand-rose)"
        className="pointer-events-none absolute top-12 left-[5%] hidden h-28 opacity-85 lg:block"
      />
      <PartyBalloon
        aria-hidden
        color="var(--brand-mint)"
        className="pointer-events-none absolute top-24 right-[5%] hidden h-24 opacity-85 lg:block"
      />
      <Heart
        aria-hidden
        fill="var(--brand-flower-pink)"
        className="pointer-events-none absolute right-[9%] bottom-16 hidden w-8 lg:block"
      />
      <Container size="sm">
        <Reveal>
          <Panel tone="lavender" className="text-center">
            <div className="font-heading text-[18px] font-bold text-white/85">
              {packageTitle}
            </div>
            <div className="mt-2 font-heading text-[64px] leading-none font-black">
              {price}
            </div>
            <div className="mt-3 text-[19px] text-white/85">{subtitle}</div>

            {includedLines.length > 0 && (
              <div className="mt-8 border-t border-white/20 pt-7">
                <div className="font-heading text-[18px] font-bold text-white/85">
                  {includedTitle}
                </div>
                <ul className="mx-auto mt-4 max-w-md space-y-2.5 text-[19px] text-white/90">
                  {includedLines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            )}

            {depositNote && (
              <div className="mt-8 border-t border-white/20 pt-7 text-[17px] text-white/80">
                {depositNote}
              </div>
            )}
          </Panel>
        </Reveal>

        {upgrades.length > 0 && (
          <Reveal className="mt-16">
            <h2 className="text-center font-heading text-[clamp(32px,4.5vw,44px)] font-black text-brand-plum">
              {upgradesTitle}
            </h2>
            <div className="mx-auto mt-6 max-w-xl divide-y divide-border">
              {upgrades.map((upgrade) => (
                <div
                  key={upgrade.id}
                  className="flex items-baseline justify-between gap-4 py-4"
                >
                  <span className="text-[19px] font-bold text-foreground">
                    {upgrade.label}
                  </span>
                  <span className="shrink-0 font-heading text-[19px] font-black text-brand-plum">
                    {upgrade.price}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {rules.length > 0 && (
          <Reveal className="mt-16">
            <h2 className="text-center font-heading text-[clamp(32px,4.5vw,44px)] font-black text-brand-plum">
              {rulesTitle}
            </h2>
            <ul className="mx-auto mt-6 max-w-xl space-y-3 text-[19px] leading-relaxed text-foreground">
              {rules.map((rule) => (
                <li key={rule} className="flex items-start gap-3">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-plum" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </Container>
    </Section>
  )
}

export { BirthdayPackage }
