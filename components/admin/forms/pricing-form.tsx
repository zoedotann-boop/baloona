"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"

import {
  AdminCard,
  AdminField,
  AdminInput,
  AdminToggle,
} from "@/components/admin/admin-ui"
import {
  LocalizedField,
  LocalizedListField,
} from "@/components/admin/localized-field"
import { RowList } from "@/components/admin/row-list"
import { SectionForm } from "@/components/admin/section-form"
import { savePricing } from "@/lib/actions/admin/content"
import {
  emptyLocalized,
  type Localized,
  type LocalizedList,
} from "@/lib/localized"

interface PricingDraft {
  title: Localized
  note: Localized
  rules: LocalizedList
  tiers: {
    id?: string
    title: Localized
    subtitle: Localized
    isFeatured: boolean
    rows: { id?: string; label: Localized; amount: number }[]
  }[]
}

/** מחירונים — the entry price cards shown on the home page. */
function PricingForm({
  slug,
  initial,
}: {
  slug: string
  initial: PricingDraft
}) {
  const t = useTranslations("admin.pricing")
  const common = useTranslations("admin.common")
  const [draft, setDraft] = useState(initial)

  return (
    <SectionForm
      slug={slug}
      title={t("title")}
      description={t("description")}
      draft={draft}
      onDraftChange={setDraft}
      onSave={(value) => savePricing({ slug, ...value })}
    >
      <AdminCard>
        <div className="space-y-4">
          <LocalizedField
            label={t("heading")}
            value={draft.title}
            onChange={(title) => setDraft((d) => ({ ...d, title }))}
          />
          <LocalizedField
            label={t("note")}
            multiline
            rows={2}
            value={draft.note}
            onChange={(note) => setDraft((d) => ({ ...d, note }))}
          />
          <LocalizedListField
            label={t("rules")}
            value={draft.rules}
            onChange={(rules) => setDraft((d) => ({ ...d, rules }))}
            addLabel={common("add")}
          />
        </div>
      </AdminCard>

      <AdminCard title={t("tiers")}>
        <RowList
          items={draft.tiers}
          onChange={(tiers) => setDraft((d) => ({ ...d, tiers }))}
          createItem={() => ({
            title: emptyLocalized(),
            subtitle: emptyLocalized(),
            isFeatured: false,
            rows: [],
          })}
          addLabel={t("addTier")}
          emptyLabel={common("empty")}
          renderRow={(tier, _index, update) => (
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <LocalizedField
                  label={t("tierTitle")}
                  value={tier.title}
                  onChange={(title) => update({ ...tier, title })}
                />
                <LocalizedField
                  label={t("tierSubtitle")}
                  value={tier.subtitle}
                  onChange={(subtitle) => update({ ...tier, subtitle })}
                />
              </div>
              <AdminToggle
                label={t("featured")}
                checked={tier.isFeatured}
                onChange={(isFeatured) => update({ ...tier, isFeatured })}
              />
              <RowList
                items={tier.rows}
                onChange={(rows) => update({ ...tier, rows })}
                createItem={() => ({ label: emptyLocalized(), amount: 0 })}
                addLabel={t("addRow")}
                renderRow={(row, _rowIndex, updateRow) => (
                  <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
                    <LocalizedField
                      label={t("rowLabel")}
                      value={row.label}
                      onChange={(label) => updateRow({ ...row, label })}
                    />
                    <AdminField label={t("rowAmount")}>
                      <AdminInput
                        type="number"
                        min={0}
                        value={row.amount}
                        onChange={(event) =>
                          updateRow({
                            ...row,
                            amount: Number(event.target.value) || 0,
                          })
                        }
                      />
                    </AdminField>
                  </div>
                )}
              />
            </div>
          )}
        />
      </AdminCard>
    </SectionForm>
  )
}

export { PricingForm }
