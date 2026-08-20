import Link from "next/link"
import { getLocale, getTranslations } from "next-intl/server"
import { ArrowRight } from "lucide-react"

import { PillButton } from "@/components/brand/pill-button"
import { BrandShell } from "@/components/layout/brand-shell"
import { SiteChrome } from "@/components/layout/site-chrome"
import { CheckoutForm } from "@/components/shop/checkout-form"
import { type Locale } from "@/i18n/routing"
import { getProductById, listPublishedLocations } from "@/lib/db/queries/site"
import { formatPrice, pickLocale } from "@/lib/localized"

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const SLUG_RE = /^[a-z0-9-]+$/i

export async function generateMetadata() {
  const t = await getTranslations("checkout")
  return { title: t("title") }
}

/** Checkout for one product; submitting hands off to PayMe (see checkout-form). */
export default async function CheckoutPage({
  searchParams,
}: PageProps<"/checkout">) {
  const { product: productParam, from: fromParam } = await searchParams
  const [locale, t, published] = await Promise.all([
    getLocale() as Promise<Locale>,
    getTranslations("checkout"),
    listPublishedLocations(),
  ])

  // `from` is the branch the visitor came from, so "back" returns to its shop
  // and — when it is a real published branch — the page wears that branch's
  // full chrome. Otherwise it falls back to the brand-global shell.
  const from =
    typeof fromParam === "string" && SLUG_RE.test(fromParam) ? fromParam : ""
  const hasBranch = from !== "" && published.some((l) => l.slug === from)
  const backHref = from ? `/${from}#shop` : "/"

  const id = typeof productParam === "string" ? productParam : ""
  const product = UUID_RE.test(id) ? await getProductById(id) : undefined

  const content = !product ? (
    <div className="mx-auto max-w-md px-5 py-20 text-center">
      <h1 className="font-heading text-[28px] font-black text-brand-plum">
        {t("noProductTitle")}
      </h1>
      <p className="mt-3 text-[16px] text-muted-foreground">
        {t("noProductBody")}
      </p>
      <PillButton href={backHref} size="md" className="mt-6">
        {t("noProductCta")}
      </PillButton>
    </div>
  ) : (
    <div className="mx-auto max-w-lg px-5 py-12 md:py-16">
      <Link
        href={backHref}
        className="mb-6 inline-flex items-center gap-1.5 text-[15px] font-bold text-brand-plum transition hover:text-foreground"
      >
        <ArrowRight className="size-4" aria-hidden />
        {t("back")}
      </Link>

      <h1 className="mb-8 text-center font-heading text-[clamp(30px,4vw,44px)] leading-[1.08] font-black text-brand-plum">
        {t("title")}
      </h1>

      <CheckoutForm
        productId={product.id}
        productName={pickLocale(product.name, locale)}
        entriesLabel={t("entries", { count: product.entries })}
        productPrice={formatPrice(product.price, locale)}
        from={from}
        termsHref={from ? `/${from}/terms` : "/"}
      />
    </div>
  )

  return hasBranch ? (
    <SiteChrome slug={from}>{content}</SiteChrome>
  ) : (
    <BrandShell>{content}</BrandShell>
  )
}
