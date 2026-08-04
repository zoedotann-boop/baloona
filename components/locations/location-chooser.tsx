import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { useTranslations } from "next-intl"

import { Confetti } from "@/components/brand/confetti"
import { LanguageSwitcher } from "@/components/brand/language-switcher"
import { Logo } from "@/components/brand/logo"
import { Photo } from "@/components/brand/photo"
import { Reveal } from "@/components/brand/reveal"

interface LocationCard {
  slug: string
  name: string
  city: string
  address: string
  description: string
  imageUrl?: string
}

/**
 * The `/` landing page: one card per published branch. With every venue owning
 * its own content, the root has nothing of its own to show — so it sends
 * visitors to a branch rather than guessing which one they want.
 */
function LocationChooser({ locations }: { locations: LocationCard[] }) {
  const t = useTranslations("locations")

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-brand-pink-soft">
      <Confetti />
      <header className="flex h-[74px] items-center justify-between px-5 md:px-9">
        <Logo size="md" />
        <LanguageSwitcher />
      </header>

      <main className="flex flex-1 items-center px-5 py-14 md:px-9">
        <div className="mx-auto w-full max-w-5xl">
          <Reveal className="text-center">
            <h1 className="font-heading text-[clamp(34px,5vw,52px)] leading-[1.1] font-black text-brand-plum">
              {t("title")}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[19px] leading-relaxed text-brand-ink-soft">
              {t("subtitle")}
            </p>
          </Reveal>

          {locations.length === 0 ? (
            <p className="mt-12 text-center text-[17px] text-brand-ink-soft">
              {t("empty")}
            </p>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {locations.map((location, index) => (
                <Reveal key={location.slug} delay={index * 90}>
                  <Link
                    href={`/${location.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-border bg-white transition hover:-translate-y-1 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    <Photo
                      src={location.imageUrl}
                      alt={location.name}
                      className="aspect-[16/10] w-full rounded-none"
                    />
                    <div className="flex flex-1 flex-col p-6">
                      <div className="font-heading text-[13px] font-black tracking-[0.12em] text-brand-rose uppercase">
                        {location.city}
                      </div>
                      <h2 className="mt-1 font-heading text-[26px] font-black text-brand-plum">
                        {location.name}
                      </h2>
                      <p className="mt-2 text-[16px] leading-relaxed text-brand-ink-soft">
                        {location.address}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-1.5 font-heading text-[17px] font-black text-primary">
                        {t("enter")}
                        <ChevronLeft className="size-5 transition group-hover:-translate-x-1 rtl:rotate-0" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export { LocationChooser }
