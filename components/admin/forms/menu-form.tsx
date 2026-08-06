"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"

import {
  AdminCard,
  AdminField,
  AdminInput,
  AdminToggle,
} from "@/components/admin/admin-ui"
import { LocalizedField } from "@/components/admin/localized-field"
import { RowList } from "@/components/admin/row-list"
import { SectionForm } from "@/components/admin/section-form"
import { saveMenu } from "@/lib/actions/admin/content"
import { emptyLocalized, type Localized } from "@/lib/localized"

interface MenuDraft {
  title: Localized
  description: Localized
  note: Localized
  categories: {
    id?: string
    label: Localized
    isVisible: boolean
    items: {
      id?: string
      name: Localized
      description: Localized
      amount: number
      isVisible: boolean
    }[]
  }[]
}

/** ניהול תפריט — categories and their priced items. */
function MenuForm({ slug, initial }: { slug: string; initial: MenuDraft }) {
  const t = useTranslations("admin.menu")
  const common = useTranslations("admin.common")
  const [draft, setDraft] = useState(initial)

  return (
    <SectionForm
      slug={slug}
      title={t("title")}
      description={t("description")}
      draft={draft}
      onDraftChange={setDraft}
      onSave={(value) => saveMenu({ slug, ...value })}
    >
      <AdminCard>
        <div className="space-y-4">
          <LocalizedField
            label={t("heading")}
            tooltip={t("headingTip")}
            value={draft.title}
            onChange={(title) => setDraft((d) => ({ ...d, title }))}
          />
          <LocalizedField
            label={t("intro")}
            tooltip={t("introTip")}
            multiline
            rows={2}
            value={draft.description}
            onChange={(description) => setDraft((d) => ({ ...d, description }))}
          />
          <LocalizedField
            label={t("note")}
            tooltip={t("noteTip")}
            multiline
            rows={2}
            value={draft.note}
            onChange={(note) => setDraft((d) => ({ ...d, note }))}
          />
        </div>
      </AdminCard>

      <AdminCard>
        <RowList
          items={draft.categories}
          onChange={(categories) => setDraft((d) => ({ ...d, categories }))}
          createItem={() => ({
            label: emptyLocalized(),
            isVisible: true,
            items: [],
          })}
          addLabel={t("addCategory")}
          emptyLabel={common("empty")}
          renderRow={(category, _index, update) => (
            <div className="space-y-3">
              <LocalizedField
                label={t("categoryLabel")}
                tooltip={t("categoryLabelTip")}
                value={category.label}
                onChange={(label) => update({ ...category, label })}
              />
              <AdminToggle
                label={t("visible")}
                checked={category.isVisible}
                onChange={(isVisible) => update({ ...category, isVisible })}
              />
              <RowList
                items={category.items}
                onChange={(items) => update({ ...category, items })}
                createItem={() => ({
                  name: emptyLocalized(),
                  description: emptyLocalized(),
                  amount: 0,
                  isVisible: true,
                })}
                addLabel={t("addItem")}
                renderRow={(item, _itemIndex, updateItem) => (
                  <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
                      <LocalizedField
                        label={t("itemName")}
                        tooltip={t("itemNameTip")}
                        value={item.name}
                        onChange={(name) => updateItem({ ...item, name })}
                      />
                      <AdminField
                        label={t("itemAmount")}
                        tooltip={t("itemAmountTip")}
                      >
                        <AdminInput
                          type="number"
                          min={0}
                          value={item.amount}
                          onChange={(event) =>
                            updateItem({
                              ...item,
                              amount: Number(event.target.value) || 0,
                            })
                          }
                        />
                      </AdminField>
                    </div>
                    <LocalizedField
                      label={t("itemDescription")}
                      tooltip={t("itemDescriptionTip")}
                      value={item.description}
                      onChange={(description) =>
                        updateItem({ ...item, description })
                      }
                    />
                    <AdminToggle
                      label={t("visible")}
                      checked={item.isVisible}
                      onChange={(isVisible) =>
                        updateItem({ ...item, isVisible })
                      }
                    />
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

export { MenuForm }
