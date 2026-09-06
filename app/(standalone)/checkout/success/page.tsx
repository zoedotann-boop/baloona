import { getTranslations } from "next-intl/server"

import { SkyBackdrop } from "@/components/brand/sky-backdrop"
import { BrandShell } from "@/components/layout/brand-shell"
import { Section } from "@/components/layout/section"
import { SiteChrome } from "@/components/layout/site-chrome"
import { CheckoutResultCard } from "@/components/shop/checkout-result-card"
import { fulfilOrder } from "@/lib/shop/orders"
import { listPublishedLocations } from "@/lib/db/queries/site"

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const SLUG_RE = /^[a-z0-9-]+$/i

export async function generateMetadata() {
  const t = await getTranslations("checkout")
  return { title: t("title") }
}

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
    <Section spacing="md" className="relative isolate overflow-hidden">
      <SkyBackdrop />
      <div className="mx-auto max-w-lg">
        <CheckoutResultCard
          title={token ? t("successTitle") : t("pendingTitle")}
          body={token ? t("successBody") : t("pendingBody")}
          cta={
            token
              ? { label: t("viewCard"), href: `/card/${token}` }
              : { label: t("noProductCta"), href: from ? `/${from}#shop` : "/" }
          }
        />
      </div>
    </Section>
  )

  return hasBranch ? (
    <SiteChrome slug={from}>{content}</SiteChrome>
  ) : (
    <BrandShell>{content}</BrandShell>
  )
}
