import { notFound } from "next/navigation"
import { getFormatter, getTranslations } from "next-intl/server"

import { BirthdayCta } from "@/components/home/birthday-cta"
import { Features } from "@/components/home/features"
import { Gallery } from "@/components/home/gallery"
import { Hero } from "@/components/home/hero"
import { MenuTeaser } from "@/components/home/menu-teaser"
import { Pricing } from "@/components/home/pricing"
import { Reassurance } from "@/components/home/reassurance"
import { Reviews } from "@/components/home/reviews"
import { ShopSection } from "@/components/home/shop-section"
import { VisionPanel } from "@/components/home/vision-panel"
import { getHomePage, listActiveProducts } from "@/lib/db/queries/site"
import {
  formatPerEntry,
  formatPrice,
  pickLocale,
  pickLocaleList,
} from "@/lib/localized"
import { buildPageMetadata } from "@/lib/seo"
import { loadSiteChrome } from "@/lib/site-view"

export async function generateMetadata({ params }: PageProps<"/[location]">) {
  const { location } = await params
  return buildPageMetadata(location, "home")
}

export default async function Page({ params }: PageProps<"/[location]">) {
  const { location: slug } = await params
  const [
    { locale, paths, contact, hours, statusLabel, isOpen },
    data,
    format,
    products,
    shopT,
  ] = await Promise.all([
    loadSiteChrome(slug),
    getHomePage(slug),
    getFormatter(),
    listActiveProducts(),
    getTranslations("shop"),
  ])

  if (!data?.home || !data.pricing) notFound()
  const { home, pricing } = data

  const galleryImages = data.galleryImages.map((image) => ({
    id: image.id,
    url: image.url,
    alt: pickLocale(image.alt, locale),
  }))

  return (
    <>
      <Hero
        statusLabel={statusLabel}
        title={pickLocale(home.heroTitle, locale)}
        description={pickLocale(home.heroDescription, locale)}
        images={home.heroImages}
        wazeHref={contact.wazeHref}
        whatsappHref={contact.whatsappHref}
        hours={hours}
        isOpen={isOpen}
      />

      <VisionPanel
        title={pickLocale(home.aboutTitle, locale)}
        body={pickLocale(home.aboutBody, locale)}
        imageUrl={home.aboutImageUrl ?? undefined}
      />

      <Features
        items={data.features.map((feature) => ({
          title: pickLocale(feature.title, locale),
          description: pickLocale(feature.description, locale),
        }))}
        ctaLabel={pickLocale(home.featuresCta, locale)}
        ctaHref={contact.whatsappHref}
      />

      <Reassurance
        title={pickLocale(home.reassuranceTitle, locale)}
        body={pickLocale(home.reassuranceBody, locale)}
        ctaLabel={pickLocale(home.reassuranceCta, locale)}
        ctaHref={contact.whatsappHref}
      />

      <Pricing
        title={pickLocale(pricing.title, locale)}
        tiers={data.priceTiers.map((tier) => ({
          id: tier.id,
          title: pickLocale(tier.title, locale),
          subtitle: pickLocale(tier.subtitle, locale),
          rows: tier.rows.map((row) => ({
            id: row.id,
            label: pickLocale(row.label, locale),
            price: formatPrice(row.amount, locale),
          })),
        }))}
        hours={hours}
        rules={pickLocaleList(pricing.rules, locale)}
        note={pickLocale(pricing.note, locale)}
      />

      <ShopSection
        title={shopT("title")}
        subtitle={shopT("subtitle")}
        note={shopT("validAllBranches")}
        benefits={shopT.raw("benefits") as string[]}
        popularLabel={shopT("popularBadge")}
        buyLabel={shopT("buy")}
        products={products.map((product) => ({
          id: product.id,
          name: pickLocale(product.name, locale),
          perEntryLabel: shopT("perEntry", {
            amount: formatPerEntry(product.price, product.entries, locale),
          }),
          price: formatPrice(product.price, locale),
          featured: product.isFeatured,
          href: `/checkout?product=${product.id}&from=${slug}`,
        }))}
      />

      <MenuTeaser
        title={pickLocale(home.menuTeaserTitle, locale)}
        body={pickLocale(home.menuTeaserBody, locale)}
        ctaLabel={pickLocale(home.menuTeaserCta, locale)}
        ctaHref={paths.menu}
        tiles={data.teaserTiles.map((tile) => ({
          id: tile.id,
          label: pickLocale(tile.label, locale),
        }))}
      />

      <BirthdayCta
        title={pickLocale(home.birthdayTeaserTitle, locale)}
        description={pickLocale(home.birthdayTeaserBody, locale)}
        ctaLabel={pickLocale(home.birthdayTeaserCta, locale)}
        ctaHref={paths.birthdays}
        imageUrl={home.birthdayTeaserImageUrl ?? undefined}
      />

      <Gallery
        title={pickLocale(home.galleryTitle, locale)}
        images={galleryImages}
      />

      <Reviews
        title={pickLocale(home.reviewsTitle, locale)}
        items={data.reviews.map((review) => ({
          id: review.id,
          text: review.text,
          name: review.authorName,
          initials: initialsOf(review.authorName),
          ago: format.relativeTime(review.publishedAt),
          rating: review.rating,
        }))}
        photos={galleryImages.slice(3).map((image) => ({
          url: image.url,
          alt: image.alt,
        }))}
      />
    </>
  )
}

/** First letter of each of the first two words, e.g. "מיכל ל." → "מל". */
function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
}
