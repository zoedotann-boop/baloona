import { notFound } from "next/navigation"
import { getLocale, getTranslations } from "next-intl/server"

import { Logo } from "@/components/brand/logo"
import { PunchCardDisplay } from "@/components/punch-cards/punch-card-display"
import { type Locale } from "@/i18n/routing"
import { getPunchCardByToken } from "@/lib/db/queries/site"
import { pickLocale } from "@/lib/localized"

/**
 * The customer's own card, reached by the opaque share link/QR the front desk
 * hands them. No login: the token is the credential. Brand-global, so it lives
 * at the app root rather than under a `/[location]` branch and renders on the
 * bare root shell (fonts, RTL, forced-light theme).
 */
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

  return (
    <main className="flex min-h-svh flex-col items-center gap-8 bg-background px-5 py-12">
      <Logo size="md" />
      <PunchCardDisplay
        className="w-full max-w-md"
        total={card.totalPunches}
        used={card.usedPunches}
        customerName={card.customer.fullName || undefined}
        branchName={
          card.issuedByLocation
            ? pickLocale(card.issuedByLocation.name, locale)
            : null
        }
        note={card.note}
      />
      <p className="max-w-md text-center text-[13px] text-muted-foreground">
        {t("footerNote")}
      </p>
    </main>
  )
}
