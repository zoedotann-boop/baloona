"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"

import {
  AdminCard,
  AdminField,
  AdminFlag,
  AdminInput,
  AdminToggle,
} from "@/components/admin/admin-ui"
import { LocalizedField } from "@/components/admin/localized-field"
import { RowTable } from "@/components/admin/row-table"
import { SectionForm } from "@/components/admin/section-form"
import { saveProducts } from "@/lib/actions/admin/shop"
import { emptyLocalized, type Localized } from "@/lib/localized"

interface ProductsDraft {
  products: {
    id?: string
    name: Localized
    entries: number
    price: number
    isActive: boolean
    isFeatured: boolean
  }[]
}

/** חנות — the punch-card packages sold in the online shop. */
function ProductsForm({
  slug,
  initial,
}: {
  slug: string
  initial: ProductsDraft
}) {
  const t = useTranslations("admin.shop")
  const common = useTranslations("admin.common")
  const [draft, setDraft] = useState(initial)

  return (
    <SectionForm
      slug={slug}
      title={t("title")}
      description={t("description")}
      draft={draft}
      onDraftChange={setDraft}
      onSave={(value) => saveProducts({ slug, ...value })}
    >
      <AdminCard title={t("products")}>
        <RowTable
          items={draft.products}
          onChange={(products) => setDraft({ products })}
          createItem={() => ({
            name: emptyLocalized(),
            entries: 10,
            price: 0,
            isActive: true,
            isFeatured: false,
          })}
          addLabel={t("addProduct")}
          emptyLabel={common("empty")}
          columns={[
            {
              header: t("name"),
              tooltip: t("nameTip"),
              cell: (product) => product.name.he,
            },
            {
              header: t("entries"),
              tooltip: t("entriesTip"),
              cell: (product) => product.entries,
              className: "w-24",
            },
            {
              header: t("price"),
              tooltip: t("priceTip"),
              cell: (product) => product.price,
              className: "w-24",
            },
            {
              header: t("active"),
              tooltip: t("activeTip"),
              cell: (product) => (
                <AdminFlag on={product.isActive} label={t("active")} />
              ),
              className: "w-28",
            },
            {
              header: t("featured"),
              tooltip: t("featuredTip"),
              cell: (product) => (
                <AdminFlag on={product.isFeatured} label={t("featured")} />
              ),
              className: "w-28",
            },
          ]}
          editTitle={(product) => product.name.he || t("addProduct")}
          renderRow={(product, _index, update) => (
            <div className="space-y-3">
              <LocalizedField
                label={t("name")}
                tooltip={t("nameTip")}
                value={product.name}
                onChange={(name) => update({ ...product, name })}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <AdminField label={t("entries")} tooltip={t("entriesTip")}>
                  <AdminInput
                    type="number"
                    min={1}
                    value={product.entries}
                    onChange={(event) =>
                      update({
                        ...product,
                        entries: Number(event.target.value) || 0,
                      })
                    }
                  />
                </AdminField>
                <AdminField label={t("price")} tooltip={t("priceTip")}>
                  <AdminInput
                    type="number"
                    min={0}
                    value={product.price}
                    onChange={(event) =>
                      update({
                        ...product,
                        price: Number(event.target.value) || 0,
                      })
                    }
                  />
                </AdminField>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <AdminToggle
                  label={t("active")}
                  tooltip={t("activeTip")}
                  checked={product.isActive}
                  onChange={(isActive) => update({ ...product, isActive })}
                />
                <AdminToggle
                  label={t("featured")}
                  tooltip={t("featuredTip")}
                  checked={product.isFeatured}
                  onChange={(isFeatured) => update({ ...product, isFeatured })}
                />
              </div>
            </div>
          )}
        />
      </AdminCard>
    </SectionForm>
  )
}

export { ProductsForm }
