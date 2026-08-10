"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"

import { AdminCard } from "@/components/admin/admin-ui"
import { LocalizedField } from "@/components/admin/localized-field"
import { SectionForm } from "@/components/admin/section-form"
import { saveTerms } from "@/lib/actions/admin/content"
import { type Localized } from "@/lib/localized"

interface TermsDraft {
  terms: Localized
}

/** תקנון ומדיניות ביטול — the editable body of the branch's /terms page. */
function TermsForm({ slug, initial }: { slug: string; initial: TermsDraft }) {
  const t = useTranslations("admin.termsEditor")
  const [draft, setDraft] = useState(initial)

  return (
    <SectionForm
      slug={slug}
      title={t("title")}
      description={t("description")}
      draft={draft}
      onDraftChange={setDraft}
      onSave={(value) => saveTerms({ slug, ...value })}
    >
      <AdminCard>
        <LocalizedField
          label={t("body")}
          tooltip={t("bodyTip")}
          multiline
          rows={18}
          value={draft.terms}
          onChange={(terms) => setDraft({ terms })}
        />
      </AdminCard>
    </SectionForm>
  )
}

export { TermsForm }
