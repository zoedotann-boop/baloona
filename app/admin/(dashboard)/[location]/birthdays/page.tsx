import { notFound } from "next/navigation"

import { BirthdaysForm } from "@/components/admin/forms/birthdays-form"
import { requireLocationAccess } from "@/lib/admin/access"
import { toLocalized, toLocalizedList, toText } from "@/lib/admin/drafts"
import { getBirthdayEditor } from "@/lib/db/queries/admin"

export default async function AdminBirthdaysPage({
  params,
}: PageProps<"/admin/[location]/birthdays">) {
  const { location: slug } = await params
  const { location } = await requireLocationAccess(slug)
  const data = await getBirthdayEditor(location.id)
  if (!data?.birthday) notFound()

  const content = data.birthday

  return (
    <BirthdaysForm
      slug={slug}
      initial={{
        content: {
          heroTitle: toLocalized(content.heroTitle),
          heroDescription: toLocalized(content.heroDescription),
          heroImageUrl: toText(content.heroImageUrl),
          stepsTitle: toLocalized(content.stepsTitle),
          stepsNote: toLocalized(content.stepsNote),
          packageTitle: toLocalized(content.packageTitle),
          packageAmount: content.packageAmount,
          packageChildrenCount: content.packageChildrenCount,
          extraChildAmount: content.extraChildAmount,
          includedTitle: toLocalized(content.includedTitle),
          depositAmount: content.depositAmount,
          depositNote: toLocalized(content.depositNote),
          upgradesTitle: toLocalized(content.upgradesTitle),
          rulesTitle: toLocalized(content.rulesTitle),
          rules: toLocalizedList(content.rules),
          formTitle: toLocalized(content.formTitle),
          formDescription: toLocalized(content.formDescription),
          cancellationPolicy: toLocalized(content.cancellationPolicy),
          consentLabel: toLocalized(content.consentLabel),
          disclaimer: toLocalized(content.disclaimer),
          successMessage: toLocalized(content.successMessage),
          requiresSignature: content.requiresSignature,
          signatureTitle: toLocalized(content.signatureTitle),
          signatureHint: toLocalized(content.signatureHint),
        },
        steps: data.steps.map((step) => ({
          id: step.id,
          title: toLocalized(step.title),
          subtitle: toLocalized(step.subtitle),
          imageUrl: toText(step.imageUrl),
        })),
        packageLines: data.packageLines.map((line) => ({
          id: line.id,
          text: toLocalized(line.text),
        })),
        upgrades: data.upgrades.map((upgrade) => ({
          id: upgrade.id,
          label: toLocalized(upgrade.label),
          amount: upgrade.amount,
          isVisible: upgrade.isVisible,
        })),
        formFields: data.formFields.map((field) => ({
          id: field.id,
          key: field.key,
          label: toLocalized(field.label),
          placeholder: toLocalized(field.placeholder),
          type: field.type,
          options: field.options.map((option) => ({
            value: option.value,
            label: toLocalized(option.label),
          })),
          minValue: field.minValue,
          maxValue: field.maxValue,
          isRequired: field.isRequired,
          isVisible: field.isVisible,
        })),
      }}
    />
  )
}
