"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"

import {
  AdminCard,
  AdminField,
  AdminFlag,
  AdminInput,
  AdminSelect,
  AdminToggle,
} from "@/components/admin/admin-ui"
import { ImageField } from "@/components/admin/image-field"
import {
  LocalizedField,
  LocalizedListField,
} from "@/components/admin/localized-field"
import { RowTable } from "@/components/admin/row-table"
import { SectionForm } from "@/components/admin/section-form"
import { saveBirthdays } from "@/lib/actions/admin/content"
import type { FormFieldType } from "@/lib/db/schema"
import {
  emptyLocalized,
  type Localized,
  type LocalizedList,
} from "@/lib/localized"

const FIELD_TYPES: FormFieldType[] = [
  "text",
  "textarea",
  "tel",
  "email",
  "date",
  "number",
  "select",
  "checkbox",
]

interface BirthdaysDraft {
  content: {
    heroTitle: Localized
    heroDescription: Localized
    heroImageUrl: string
    stepsTitle: Localized
    stepsNote: Localized
    packageTitle: Localized
    packageAmount: number
    packageChildrenCount: number
    extraChildAmount: number
    includedTitle: Localized
    depositAmount: number
    depositNote: Localized
    upgradesTitle: Localized
    rulesTitle: Localized
    rules: LocalizedList
    formTitle: Localized
    formDescription: Localized
    cancellationPolicy: Localized
    consentLabel: Localized
    disclaimer: Localized
    successMessage: Localized
    requiresSignature: boolean
    signatureTitle: Localized
    signatureHint: Localized
  }
  steps: {
    id?: string
    title: Localized
    subtitle: Localized
    imageUrl: string
  }[]
  packageLines: { id?: string; text: Localized }[]
  upgrades: {
    id?: string
    label: Localized
    amount: number
    isVisible: boolean
  }[]
  formFields: {
    id?: string
    key: string
    label: Localized
    placeholder: Localized
    type: FormFieldType
    options: { value: string; label: Localized }[]
    isRequired: boolean
    isVisible: boolean
  }[]
}

/** ימי הולדת — page copy, package pricing and the booking form's fields. */
function BirthdaysForm({
  slug,
  initial,
}: {
  slug: string
  initial: BirthdaysDraft
}) {
  const t = useTranslations("admin.birthdays")
  const common = useTranslations("admin.common")
  const [draft, setDraft] = useState(initial)

  const content = <K extends keyof BirthdaysDraft["content"]>(
    key: K,
    value: BirthdaysDraft["content"][K]
  ) =>
    setDraft((current) => ({
      ...current,
      content: { ...current.content, [key]: value },
    }))

  const numberField = (
    label: string,
    tooltip: string,
    key:
      | "packageAmount"
      | "packageChildrenCount"
      | "extraChildAmount"
      | "depositAmount"
  ) => (
    <AdminField label={label} tooltip={tooltip}>
      <AdminInput
        type="number"
        min={0}
        value={draft.content[key]}
        onChange={(event) => content(key, Number(event.target.value) || 0)}
      />
    </AdminField>
  )

  return (
    <SectionForm
      slug={slug}
      title={t("title")}
      description={t("description")}
      draft={draft}
      onDraftChange={setDraft}
      onSave={(value) => saveBirthdays({ slug, ...value })}
    >
      <AdminCard title={t("heroTitle")}>
        <div className="space-y-4">
          <LocalizedField
            label={t("heroHeading")}
            tooltip={t("heroHeadingTip")}
            value={draft.content.heroTitle}
            onChange={(value) => content("heroTitle", value)}
          />
          <LocalizedField
            label={t("heroDescription")}
            tooltip={t("heroDescriptionTip")}
            multiline
            value={draft.content.heroDescription}
            onChange={(value) => content("heroDescription", value)}
          />
          <ImageField
            label={t("heroImage")}
            tooltip={t("heroImageTip")}
            folder="hero"
            value={draft.content.heroImageUrl}
            onChange={(value) => content("heroImageUrl", value)}
          />
        </div>
      </AdminCard>

      <AdminCard title={t("stepsTitle")}>
        <div className="space-y-4">
          <LocalizedField
            label={t("stepsHeading")}
            tooltip={t("stepsHeadingTip")}
            value={draft.content.stepsTitle}
            onChange={(value) => content("stepsTitle", value)}
          />
          <LocalizedField
            label={t("stepsNote")}
            tooltip={t("stepsNoteTip")}
            multiline
            rows={2}
            value={draft.content.stepsNote}
            onChange={(value) => content("stepsNote", value)}
          />
          <RowTable
            items={draft.steps}
            onChange={(steps) => setDraft((d) => ({ ...d, steps }))}
            createItem={() => ({
              title: emptyLocalized(),
              subtitle: emptyLocalized(),
              imageUrl: "",
            })}
            addLabel={t("addStep")}
            emptyLabel={common("empty")}
            columns={[
              {
                header: t("stepTitle"),
                tooltip: t("stepTitleTip"),
                cell: (step) => step.title.he,
              },
              {
                header: t("stepSubtitle"),
                tooltip: t("stepSubtitleTip"),
                cell: (step) => (
                  <span className="line-clamp-1 text-muted-foreground">
                    {step.subtitle.he}
                  </span>
                ),
              },
            ]}
            editTitle={(step) => step.title.he || t("addStep")}
            renderRow={(step, _index, update) => (
              <div className="space-y-3">
                <LocalizedField
                  label={t("stepTitle")}
                  tooltip={t("stepTitleTip")}
                  value={step.title}
                  onChange={(title) => update({ ...step, title })}
                />
                <LocalizedField
                  label={t("stepSubtitle")}
                  tooltip={t("stepSubtitleTip")}
                  value={step.subtitle}
                  onChange={(subtitle) => update({ ...step, subtitle })}
                />
                <ImageField
                  label={t("stepImage")}
                  tooltip={t("stepImageTip")}
                  folder="steps"
                  value={step.imageUrl}
                  onChange={(imageUrl) => update({ ...step, imageUrl })}
                />
              </div>
            )}
          />
        </div>
      </AdminCard>

      <AdminCard title={t("packageTitle")}>
        <div className="space-y-4">
          <LocalizedField
            label={t("packageHeading")}
            tooltip={t("packageHeadingTip")}
            value={draft.content.packageTitle}
            onChange={(value) => content("packageTitle", value)}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {numberField(
              t("packageAmount"),
              t("packageAmountTip"),
              "packageAmount"
            )}
            {numberField(
              t("packageChildren"),
              t("packageChildrenTip"),
              "packageChildrenCount"
            )}
            {numberField(
              t("extraChild"),
              t("extraChildTip"),
              "extraChildAmount"
            )}
            {numberField(
              t("depositAmount"),
              t("depositAmountTip"),
              "depositAmount"
            )}
          </div>
          <LocalizedField
            label={t("depositNote")}
            tooltip={t("depositNoteTip")}
            value={draft.content.depositNote}
            onChange={(value) => content("depositNote", value)}
          />
          <LocalizedField
            label={t("includedTitle")}
            tooltip={t("includedTitleTip")}
            value={draft.content.includedTitle}
            onChange={(value) => content("includedTitle", value)}
          />
          <div>
            <div className="mb-2 text-[13px] font-bold text-brand-plum">
              {t("packageLines")}
            </div>
            <RowTable
              items={draft.packageLines}
              onChange={(packageLines) =>
                setDraft((d) => ({ ...d, packageLines }))
              }
              createItem={() => ({ text: emptyLocalized() })}
              addLabel={t("addLine")}
              emptyLabel={common("empty")}
              columns={[
                {
                  header: t("lineText"),
                  tooltip: t("lineTextTip"),
                  cell: (line) => line.text.he,
                },
              ]}
              editTitle={(line) => line.text.he || t("addLine")}
              renderRow={(line, _index, update) => (
                <LocalizedField
                  label={t("lineText")}
                  tooltip={t("lineTextTip")}
                  value={line.text}
                  onChange={(text) => update({ ...line, text })}
                />
              )}
            />
          </div>
        </div>
      </AdminCard>

      <AdminCard title={t("upgradesTitle")}>
        <div className="space-y-4">
          <LocalizedField
            label={t("upgradesHeading")}
            tooltip={t("upgradesHeadingTip")}
            value={draft.content.upgradesTitle}
            onChange={(value) => content("upgradesTitle", value)}
          />
          <RowTable
            items={draft.upgrades}
            onChange={(upgrades) => setDraft((d) => ({ ...d, upgrades }))}
            createItem={() => ({
              label: emptyLocalized(),
              amount: 0,
              isVisible: true,
            })}
            addLabel={t("addUpgrade")}
            emptyLabel={common("empty")}
            columns={[
              {
                header: t("upgradeLabel"),
                tooltip: t("upgradeLabelTip"),
                cell: (upgrade) => upgrade.label.he,
              },
              {
                header: t("upgradeAmount"),
                tooltip: t("upgradeAmountTip"),
                cell: (upgrade) => upgrade.amount,
                className: "w-24",
              },
              {
                header: t("fieldVisible"),
                cell: (upgrade) => (
                  <AdminFlag on={upgrade.isVisible} label={t("fieldVisible")} />
                ),
                className: "w-32",
              },
            ]}
            editTitle={(upgrade) => upgrade.label.he || t("addUpgrade")}
            renderRow={(upgrade, _index, update) => (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
                  <LocalizedField
                    label={t("upgradeLabel")}
                    tooltip={t("upgradeLabelTip")}
                    value={upgrade.label}
                    onChange={(label) => update({ ...upgrade, label })}
                  />
                  <AdminField
                    label={t("upgradeAmount")}
                    tooltip={t("upgradeAmountTip")}
                  >
                    <AdminInput
                      type="number"
                      min={0}
                      value={upgrade.amount}
                      onChange={(event) =>
                        update({
                          ...upgrade,
                          amount: Number(event.target.value) || 0,
                        })
                      }
                    />
                  </AdminField>
                </div>
                <AdminToggle
                  label={t("fieldVisible")}
                  checked={upgrade.isVisible}
                  onChange={(isVisible) => update({ ...upgrade, isVisible })}
                />
              </div>
            )}
          />
        </div>
      </AdminCard>

      <AdminCard title={t("rulesTitle")}>
        <div className="space-y-4">
          <LocalizedField
            label={t("rulesHeading")}
            tooltip={t("rulesHeadingTip")}
            value={draft.content.rulesTitle}
            onChange={(value) => content("rulesTitle", value)}
          />
          <LocalizedListField
            label={t("rules")}
            tooltip={t("rulesTip")}
            value={draft.content.rules}
            onChange={(value) => content("rules", value)}
            addLabel={common("add")}
          />
        </div>
      </AdminCard>

      <AdminCard title={t("formTitle")}>
        <div className="space-y-4">
          <LocalizedField
            label={t("formHeading")}
            tooltip={t("formHeadingTip")}
            value={draft.content.formTitle}
            onChange={(value) => content("formTitle", value)}
          />
          <LocalizedField
            label={t("formDescription")}
            tooltip={t("formDescriptionTip")}
            multiline
            rows={2}
            value={draft.content.formDescription}
            onChange={(value) => content("formDescription", value)}
          />
          <LocalizedField
            label={t("cancellationPolicy")}
            tooltip={t("cancellationPolicyTip")}
            multiline
            rows={3}
            value={draft.content.cancellationPolicy}
            onChange={(value) => content("cancellationPolicy", value)}
          />
          <LocalizedField
            label={t("consentLabel")}
            tooltip={t("consentLabelTip")}
            multiline
            rows={2}
            value={draft.content.consentLabel}
            onChange={(value) => content("consentLabel", value)}
          />
          <LocalizedField
            label={t("disclaimer")}
            tooltip={t("disclaimerTip")}
            multiline
            rows={2}
            value={draft.content.disclaimer}
            onChange={(value) => content("disclaimer", value)}
          />
          <LocalizedField
            label={t("successMessage")}
            tooltip={t("successMessageTip")}
            multiline
            rows={2}
            value={draft.content.successMessage}
            onChange={(value) => content("successMessage", value)}
          />
          <AdminToggle
            label={t("requiresSignature")}
            checked={draft.content.requiresSignature}
            onChange={(value) => content("requiresSignature", value)}
          />
          {draft.content.requiresSignature && (
            <div className="grid gap-4 sm:grid-cols-2">
              <LocalizedField
                label={t("signatureTitle")}
                tooltip={t("signatureTitleTip")}
                value={draft.content.signatureTitle}
                onChange={(value) => content("signatureTitle", value)}
              />
              <LocalizedField
                label={t("signatureHint")}
                tooltip={t("signatureHintTip")}
                value={draft.content.signatureHint}
                onChange={(value) => content("signatureHint", value)}
              />
            </div>
          )}
        </div>
      </AdminCard>

      <AdminCard title={t("fieldsTitle")} description={t("fieldsDescription")}>
        <RowTable
          items={draft.formFields}
          onChange={(formFields) => setDraft((d) => ({ ...d, formFields }))}
          createItem={() => ({
            key: "",
            label: emptyLocalized(),
            placeholder: emptyLocalized(),
            type: "text" as FormFieldType,
            options: [],
            isRequired: false,
            isVisible: true,
          })}
          addLabel={t("addField")}
          emptyLabel={common("empty")}
          columns={[
            {
              header: t("fieldLabel"),
              tooltip: t("fieldLabelTip"),
              cell: (field) => field.label.he,
            },
            {
              header: t("fieldKey"),
              tooltip: t("fieldKeyTip"),
              cell: (field) => (
                <span
                  dir="ltr"
                  className="block text-start text-muted-foreground"
                >
                  {field.key}
                </span>
              ),
              className: "w-36",
            },
            {
              header: t("fieldType"),
              tooltip: t("fieldTypeTip"),
              cell: (field) => field.type,
              className: "w-24",
            },
            {
              header: t("fieldRequired"),
              cell: (field) => (
                <AdminFlag on={field.isRequired} label={t("fieldRequired")} />
              ),
              className: "w-28",
            },
            {
              header: t("fieldVisible"),
              cell: (field) => (
                <AdminFlag on={field.isVisible} label={t("fieldVisible")} />
              ),
              className: "w-28",
            },
          ]}
          editTitle={(field) => field.label.he || t("addField")}
          renderRow={(field, _index, update) => (
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <AdminField label={t("fieldKey")} tooltip={t("fieldKeyTip")}>
                  <AdminInput
                    value={field.key}
                    dir="ltr"
                    onChange={(event) =>
                      update({ ...field, key: event.target.value })
                    }
                  />
                </AdminField>
                <AdminField label={t("fieldType")} tooltip={t("fieldTypeTip")}>
                  <AdminSelect
                    value={field.type}
                    onChange={(event) =>
                      update({
                        ...field,
                        type: event.target.value as FormFieldType,
                      })
                    }
                  >
                    {FIELD_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {t(`types.${type}`)}
                      </option>
                    ))}
                  </AdminSelect>
                </AdminField>
              </div>
              <LocalizedField
                label={t("fieldLabel")}
                tooltip={t("fieldLabelTip")}
                value={field.label}
                onChange={(label) => update({ ...field, label })}
              />
              <LocalizedField
                label={t("fieldPlaceholder")}
                tooltip={t("fieldPlaceholderTip")}
                value={field.placeholder}
                onChange={(placeholder) => update({ ...field, placeholder })}
              />

              {field.type === "select" && (
                <div>
                  <div className="mb-2 text-[13px] font-bold text-brand-plum">
                    {t("fieldOptions")}
                  </div>
                  <RowTable
                    items={field.options}
                    onChange={(options) => update({ ...field, options })}
                    createItem={() => ({ value: "", label: emptyLocalized() })}
                    addLabel={t("addOption")}
                    columns={[
                      {
                        header: t("optionValue"),
                        tooltip: t("optionValueTip"),
                        cell: (option) => (
                          <span dir="ltr" className="block text-start">
                            {option.value}
                          </span>
                        ),
                        className: "w-40",
                      },
                      {
                        header: t("optionLabel"),
                        tooltip: t("optionLabelTip"),
                        cell: (option) => option.label.he,
                      },
                    ]}
                    editTitle={(option) =>
                      option.label.he || option.value || common("add")
                    }
                    renderRow={(option, _optionIndex, updateOption) => (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <AdminField
                          label={t("optionValue")}
                          tooltip={t("optionValueTip")}
                        >
                          <AdminInput
                            value={option.value}
                            dir="ltr"
                            onChange={(event) =>
                              updateOption({
                                ...option,
                                value: event.target.value,
                              })
                            }
                          />
                        </AdminField>
                        <LocalizedField
                          label={t("optionLabel")}
                          tooltip={t("optionLabelTip")}
                          value={option.label}
                          onChange={(label) =>
                            updateOption({ ...option, label })
                          }
                        />
                      </div>
                    )}
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-5">
                <AdminToggle
                  label={t("fieldRequired")}
                  checked={field.isRequired}
                  onChange={(isRequired) => update({ ...field, isRequired })}
                />
                <AdminToggle
                  label={t("fieldVisible")}
                  checked={field.isVisible}
                  onChange={(isVisible) => update({ ...field, isVisible })}
                />
              </div>
            </div>
          )}
        />
      </AdminCard>
    </SectionForm>
  )
}

export { BirthdaysForm }
