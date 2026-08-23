import { getTranslations } from "next-intl/server"

import { PillButton } from "@/components/brand/pill-button"
import { BrandShell } from "@/components/layout/brand-shell"
import { SiteChrome } from "@/components/layout/site-chrome"
import { fulfilOrder } from "@/lib/shop/orders"
import { listPublishedLocations } from "@/lib/db/queries/site"

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const SLUG_RE = /^[a-z0-9-]+$/i

export async function generateMetadata() {
  const t = await getTranslations("checkout")
  return { title: t("title") }
}

/**
 * Landing page after PayMe redirects a paid buyer back. It re-verifies the
 * payment and issues the card (idempotent with the server callback, and a
 * safety net if that callback is delayed). A confirmed order shows the card
 * link; an unconfirmed one shows a "still processing" note. It wears the source
 * branch's chrome when `from` is a known branch, mirroring the checkout page.
 */
export default async function CheckoutSuccessPage({
  searchParams,
}: PageProps<"/checkout/success">) {
  const { order, from: fromParam } = await searchParams
  const [t, published] = await Promise.all([
    getTranslations("checkout"),
    listPublishedLocations(),
  ])

  const from =
    typeof fromParam === "string" && SLUG_RE.test(fromParam) ? fromParam : ""
  const hasBranch = from !== "" && published.some((l) => l.slug === from)

  const orderId = typeof order === "string" && UUID_RE.test(order) ? order : ""
  const token = orderId ? await fulfilOrder(orderId) : null

  const content = (
    <div className="mx-auto max-w-lg px-5 py-16 md:py-20">
      <div className="rounded-[26px] border border-border bg-brand-lavender-soft p-8 text-center">
        <p className="font-heading text-[22px] font-black text-brand-plum">
          {token ? t("successTitle") : t("pendingTitle")}
        </p>
        <p className="mt-2 text-[16px] leading-relaxed text-brand-ink-soft">
          {token ? t("successBody") : t("pendingBody")}
        </p>
        {token ? (
          <PillButton href={`/card/${token}`} size="md" className="mt-5">
            {t("viewCard")}
          </PillButton>
        ) : (
          <PillButton
            href={from ? `/${from}#shop` : "/"}
            size="md"
            className="mt-5"
          >
            {t("noProductCta")}
          </PillButton>
        )}
      </div>
    </div>
  )

  return hasBranch ? (
    <SiteChrome slug={from}>{content}</SiteChrome>
  ) : (
    <BrandShell>{content}</BrandShell>
  )
}
