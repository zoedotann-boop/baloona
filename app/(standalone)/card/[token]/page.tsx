import { notFound } from "next/navigation"
import { getLocale, getTranslations } from "next-intl/server"

import { SkyBackdrop } from "@/components/brand/sky-backdrop"
import { BrandShell } from "@/components/layout/brand-shell"
import { PunchCardDisplay } from "@/components/punch-cards/punch-card-display"
import { type Locale } from "@/i18n/routing"
import { getPunchCardByToken } from "@/lib/db/queries/site"
import { pickLocale } from "@/lib/localized"

export default async function PunchCardPage({
  params,
}: PageProps<"/card/[token]">) {
  const { token } = await params
  const [card, locale, t] = await Promise.all([
    getPunchCardByToken(token),
    getLocale() as Promise<Locale>,
    getTranslations("punchCard"),
  ])

  if (!card) notFound()

  const dateFormat = new Intl.DateTimeFormat(
    locale === "he" ? "he-IL" : "en-US",
    { dateStyle: "short", timeStyle: "short" }
  )
  const punches = card.events.map((event) => ({
    id: event.id,
    at: dateFormat.format(event.createdAt),
  }))

  return (
    <BrandShell>
      <div className="relative isolate overflow-hidden">
        <SkyBackdrop />
        <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-5 py-12">
          <PunchCardDisplay
            className="w-full"
            total={card.totalPunches}
            used={card.usedPunches}
            punches={punches}
            customerName={card.customer.fullName || undefined}
            branchName={
              card.issuedByLocation
                ? pickLocale(card.issuedByLocation.name, locale)
                : null
            }
            note={card.note}
          />
          <p className="text-center text-[13px] text-muted-foreground">
            {t("footerNote")}
          </p>
        </div>
      </div>
    </BrandShell>
  )
}
