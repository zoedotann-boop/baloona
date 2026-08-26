import { notFound } from "next/navigation"
import { getLocale, getTranslations } from "next-intl/server"

import { BirthdayHero } from "@/components/birthdays/birthday-hero"
import { BirthdayLeadForm } from "@/components/birthdays/birthday-lead-form"
import { BirthdayPackage } from "@/components/birthdays/birthday-package"
import { BirthdaySteps } from "@/components/birthdays/birthday-steps"
import { type Locale } from "@/i18n/routing"
import { getBirthdayPage } from "@/lib/db/queries/site"
import { formatPrice, pickLocale, pickLocaleList } from "@/lib/localized"
import { buildPageMetadata } from "@/lib/seo"

export async function generateMetadata({
  params,
}: PageProps<"/[location]/birthdays">) {
  const { location } = await params
  return buildPageMetadata(location, "birthdays")
}

export default async function BirthdaysPage({
  params,
}: PageProps<"/[location]/birthdays">) {
  const { location: slug } = await params
  const [data, locale, t] = await Promise.all([
    getBirthdayPage(slug),
    getLocale() as Promise<Locale>,
    getTranslations("birthdays"),
  ])

  if (!data?.birthday) notFound()
  const content = data.birthday

  const packagePrice = formatPrice(content.packageAmount, locale)
  const packageSubtitle = t("packageSubtitle", {
    count: content.packageChildrenCount,
    price: formatPrice(content.extraChildAmount, locale),
  })

  const upgrades = data.upgrades.map((upgrade) => ({
    id: upgrade.id,
    label: pickLocale(upgrade.label, locale),
    price: formatPrice(upgrade.amount, locale),
  }))

  return (
    <>
      <BirthdayHero
        title={pickLocale(content.heroTitle, locale)}
        description={pickLocale(content.heroDescription, locale)}
        imageUrl={content.heroImageUrl ?? undefined}
      />

      <BirthdaySteps
        title={pickLocale(content.stepsTitle, locale)}
        note={pickLocale(content.stepsNote, locale)}
        steps={data.steps.map((step) => ({
          id: step.id,
          title: pickLocale(step.title, locale),
          subtitle: pickLocale(step.subtitle, locale),
        }))}
      />

      <BirthdayPackage
        packageTitle={pickLocale(content.packageTitle, locale)}
        price={packagePrice}
        subtitle={packageSubtitle}
        includedTitle={pickLocale(content.includedTitle, locale)}
        includedLines={data.packageLines.map((line) =>
          pickLocale(line.text, locale)
        )}
        depositNote={pickLocale(content.depositNote, locale)}
        upgradesTitle={pickLocale(content.upgradesTitle, locale)}
        upgrades={upgrades}
        rulesTitle={pickLocale(content.rulesTitle, locale)}
        rules={pickLocaleList(content.rules, locale)}
      />

      <BirthdayLeadForm
        locationId={data.id}
        title={pickLocale(content.formTitle, locale)}
        description={pickLocale(content.formDescription, locale)}
        fields={data.formFields.map((field) => ({
          key: field.key,
          label: pickLocale(field.label, locale),
          placeholder: pickLocale(field.placeholder, locale) || undefined,
          type: field.type,
          options: field.options.map((option) => ({
            value: option.value,
            label: pickLocale(option.label, locale),
          })),
          min: field.minValue,
          max: field.maxValue,
          isRequired: field.isRequired,
        }))}
        upgradesTitle={pickLocale(content.upgradesTitle, locale)}
        upgrades={upgrades}
        packageSummary={t("packageSummary", {
          count: content.packageChildrenCount,
        })}
        packagePrice={packagePrice}
        depositNote={pickLocale(content.depositNote, locale)}
        cancellationPolicy={pickLocale(content.cancellationPolicy, locale)}
        consentLabel={pickLocale(content.consentLabel, locale)}
        disclaimer={pickLocale(content.disclaimer, locale)}
        successMessage={pickLocale(content.successMessage, locale)}
        requiresSignature={content.requiresSignature}
        signatureTitle={pickLocale(content.signatureTitle, locale)}
        signatureHint={pickLocale(content.signatureHint, locale)}
      />
    </>
  )
}
