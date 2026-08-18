import { getTranslations } from "next-intl/server"

import { PillButton } from "@/components/brand/pill-button"
import { fulfilOrder } from "@/lib/shop/orders"

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function generateMetadata() {
  const t = await getTranslations("checkout")
  return { title: t("title") }
}

/**
 * Landing page after PayMe redirects a paid buyer back. It re-verifies the
 * payment and issues the card (idempotent with the server callback, and a
 * safety net if that callback is delayed). A confirmed order shows the card
 * link; an unconfirmed one shows a "still processing" note.
 */
export default async function CheckoutSuccessPage({
  searchParams,
}: PageProps<"/checkout/success">) {
  const { order } = await searchParams
  const t = await getTranslations("checkout")

  const orderId = typeof order === "string" && UUID_RE.test(order) ? order : ""
  const token = orderId ? await fulfilOrder(orderId) : null

  return (
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
          <PillButton href="/" size="md" className="mt-5">
            {t("noProductCta")}
          </PillButton>
        )}
      </div>
    </div>
  )
}
