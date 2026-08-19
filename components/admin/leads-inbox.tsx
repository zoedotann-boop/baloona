"use client"

import { useTranslations } from "next-intl"
import { Eye, Trash2 } from "lucide-react"
import { useState, useTransition } from "react"

import { AdminModal } from "@/components/admin/admin-modal"
import {
  adminCell,
  AdminTable,
  AdminTableEmpty,
  AdminTableRow,
} from "@/components/admin/admin-table"
import { deleteLead, updateLeadStatus } from "@/lib/actions/admin/leads"
import type { LeadKind, LeadStatus } from "@/lib/db/schema"
import { cn } from "@/lib/utils"

const STATUSES: LeadStatus[] = ["new", "in_progress", "done", "archived"]

interface InboxLead {
  id: string
  kind: LeadKind
  status: LeadStatus
  fullName: string
  phone: string
  email: string
  subject: string | null
  message: string | null
  /** Answers to the branch's editable form questions, as label → value. */
  details: { label: string; value: string }[]
  upgrades: { label: string; price: string }[]
  total: string | null
  signatureUrl: string | null
  createdAt: string
  notifyError: string | null
}

/**
 * פניות — the inbox for birthday bookings and contact messages.
 *
 * Birthday answers render as a plain label/value list because the questions are
 * editor-defined: whatever the form asks today shows up here without the inbox
 * needing to know about it.
 */
function LeadsInbox({ slug, leads }: { slug: string; leads: InboxLead[] }) {
  const t = useTranslations("admin.leads")
  const common = useTranslations("admin.common")
  const [filter, setFilter] = useState<LeadStatus | "all">("all")
  const [openLead, setOpenLead] = useState<string | null>(null)
  const [pending, start] = useTransition()

  const visible =
    filter === "all" ? leads : leads.filter((lead) => lead.status === filter)

  const statusLabel = (status: LeadStatus) =>
    ({
      new: t("statusNew"),
      in_progress: t("statusInProgress"),
      done: t("statusDone"),
      archived: t("statusArchived"),
    })[status]

  return (
    <div className="pb-10">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <div className="min-w-0">
          <h1 className="font-heading text-[24px] font-black text-brand-plum">
            {t("title")}
          </h1>
          <p className="mt-0.5 text-[14px] text-muted-foreground">
            {t("description")}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(["all", ...STATUSES] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              aria-pressed={filter === option}
              className={cn(
                "h-9 rounded-full px-4 text-[14px] font-bold transition",
                filter === option
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:brightness-95"
              )}
            >
              {option === "all" ? t("filterAll") : statusLabel(option)}
            </button>
          ))}
        </div>
      </header>

      <AdminTable
        headers={[
          { label: t("kind"), className: "w-28" },
          t("name"),
          { label: t("phone"), className: "w-36" },
          { label: t("createdAt"), className: "w-32" },
          { label: t("status"), className: "w-40" },
          { label: common("actions"), className: "w-px sr-only" },
        ]}
      >
        {visible.length === 0 && (
          <AdminTableEmpty colSpan={6} label={t("empty")} />
        )}

        {visible.map((lead) => (
          <AdminTableRow key={lead.id}>
            <td className={cn(adminCell, "w-28")}>
              <span className="rounded-full bg-brand-pink px-2.5 py-0.5 text-[12px] font-black whitespace-nowrap text-brand-plum">
                {lead.kind === "birthday"
                  ? t("kindBirthday")
                  : t("kindContact")}
              </span>
            </td>
            <td className={adminCell}>
              <span className="font-bold text-brand-plum">
                {lead.fullName || "—"}
              </span>
              {lead.notifyError && (
                <span className="ms-2 text-[12px] font-bold text-destructive">
                  {t("notifyFailedShort")}
                </span>
              )}
            </td>
            <td className={cn(adminCell, "w-36")}>
              <span
                dir="ltr"
                className="block text-start text-muted-foreground"
              >
                {lead.phone || "—"}
              </span>
            </td>
            <td
              className={cn(
                adminCell,
                "w-32 whitespace-nowrap text-muted-foreground"
              )}
            >
              {lead.createdAt}
            </td>
            <td className={cn(adminCell, "w-40")}>
              <select
                value={lead.status}
                disabled={pending}
                onChange={(event) =>
                  start(async () => {
                    await updateLeadStatus({
                      slug,
                      leadId: lead.id,
                      status: event.target.value as LeadStatus,
                    })
                  })
                }
                className="h-9 w-full rounded-xl border border-border bg-white px-2.5 text-[13px] font-bold text-brand-plum focus:border-primary focus:outline-none"
                aria-label={t("status")}
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {statusLabel(status)}
                  </option>
                ))}
              </select>
            </td>
            <td className="px-2 py-1.5">
              <div className="flex items-center justify-end gap-0.5">
                <button
                  type="button"
                  onClick={() => setOpenLead(lead.id)}
                  aria-label={t("view")}
                  className="flex size-8 items-center justify-center rounded-lg text-brand-plum transition hover:bg-white"
                >
                  <Eye className="size-4" />
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    start(async () => {
                      await deleteLead({ slug, leadId: lead.id })
                    })
                  }
                  aria-label={t("delete")}
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <AdminModal
                open={openLead === lead.id}
                onClose={() => setOpenLead(null)}
                title={lead.fullName || t("kindContact")}
              >
                <dl className="grid gap-x-6 gap-y-1.5 text-[15px] sm:grid-cols-2">
                  <Row label={t("phone")} value={lead.phone} dir="ltr" />
                  <Row label={t("email")} value={lead.email} dir="ltr" />
                  <Row label={t("subject")} value={lead.subject} />
                  <Row label={t("createdAt")} value={lead.createdAt} />
                  {lead.details.map((detail) => (
                    <Row
                      key={detail.label}
                      label={detail.label}
                      value={detail.value}
                    />
                  ))}
                  {lead.upgrades.length > 0 && (
                    <Row
                      label={t("upgrades")}
                      value={lead.upgrades
                        .map((upgrade) => `${upgrade.label} (${upgrade.price})`)
                        .join(", ")}
                    />
                  )}
                  <Row label={t("total")} value={lead.total} />
                </dl>

                {lead.message && (
                  <p className="rounded-2xl bg-muted p-3 text-[15px] leading-relaxed whitespace-pre-line text-foreground">
                    {lead.message}
                  </p>
                )}

                {lead.signatureUrl && (
                  <a
                    href={lead.signatureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-[14px] font-bold text-primary underline"
                  >
                    {t("viewSignature")}
                  </a>
                )}

                {lead.notifyError && (
                  <p className="text-[13px] font-bold text-destructive">
                    {t("notifyFailed", { error: lead.notifyError })}
                  </p>
                )}
              </AdminModal>
            </td>
          </AdminTableRow>
        ))}
      </AdminTable>
    </div>
  )
}

function Row({
  label,
  value,
  dir,
}: {
  label: string
  value: string | null
  dir?: "ltr"
}) {
  if (!value) return null
  return (
    <div className="flex gap-2">
      <dt className="shrink-0 font-bold text-muted-foreground">{label}</dt>
      <dd dir={dir} className={cn("text-foreground", dir && "text-start")}>
        {value}
      </dd>
    </div>
  )
}

export { LeadsInbox }
