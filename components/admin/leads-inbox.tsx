"use client"

import { useTranslations } from "next-intl"
import { Trash2 } from "lucide-react"
import { useState, useTransition } from "react"

import { AdminCard } from "@/components/admin/admin-ui"
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
  const [filter, setFilter] = useState<LeadStatus | "all">("all")
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
      <header className="mb-6">
        <h1 className="font-heading text-[28px] font-black text-brand-plum">
          {t("title")}
        </h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          {t("description")}
        </p>
      </header>

      <div className="mb-5 flex flex-wrap gap-2">
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

      {visible.length === 0 ? (
        <p className="py-16 text-center text-[15px] text-muted-foreground">
          {t("empty")}
        </p>
      ) : (
        <div className="space-y-4">
          {visible.map((lead) => (
            <AdminCard key={lead.id}>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-pink px-2.5 py-0.5 text-[12px] font-black text-brand-plum">
                  {lead.kind === "birthday"
                    ? t("kindBirthday")
                    : t("kindContact")}
                </span>
                <span className="font-heading text-[17px] font-black text-brand-plum">
                  {lead.fullName || "—"}
                </span>
                <span className="text-[13px] text-muted-foreground">
                  {t("createdAt")}: {lead.createdAt}
                </span>

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
                  className="ms-auto h-9 rounded-xl border border-border bg-white px-2.5 text-[13px] font-bold text-brand-plum focus:border-primary focus:outline-none"
                  aria-label={t("status")}
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {statusLabel(status)}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    start(async () => {
                      await deleteLead({ slug, leadId: lead.id })
                    })
                  }
                  aria-label={t("delete")}
                  className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <dl className="grid gap-x-6 gap-y-1.5 text-[15px] sm:grid-cols-2">
                <Row label={t("phone")} value={lead.phone} dir="ltr" />
                <Row label={t("email")} value={lead.email} dir="ltr" />
                <Row label={t("subject")} value={lead.subject} />
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
                <p className="mt-3 rounded-2xl bg-muted p-3 text-[15px] leading-relaxed whitespace-pre-line text-foreground">
                  {lead.message}
                </p>
              )}

              {lead.signatureUrl && (
                <a
                  href={lead.signatureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-[14px] font-bold text-primary underline"
                >
                  {t("viewSignature")}
                </a>
              )}

              {lead.notifyError && (
                <p className="mt-3 text-[13px] font-bold text-destructive">
                  {t("notifyFailed", { error: lead.notifyError })}
                </p>
              )}
            </AdminCard>
          ))}
        </div>
      )}
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
