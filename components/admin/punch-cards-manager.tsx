"use client"

import { useTranslations } from "next-intl"
import {
  Check,
  Copy,
  ExternalLink,
  Minus,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react"
import { useRef, useState, useTransition } from "react"

import { ConfirmModal } from "@/components/admin/confirm-modal"
import { useToast } from "@/components/admin/toast"
import { AdminCard, AdminField, AdminInput } from "@/components/admin/admin-ui"
import { PillButton } from "@/components/brand/pill-button"
import {
  deleteCard,
  issuePunchCard,
  punchCard,
  searchPunchCards,
  undoLastPunch,
  updateCardDetails,
  updateCustomerDetails,
} from "@/lib/actions/admin/punch-cards"
import { remainingPunches, type CustomerCardsView } from "@/lib/punch-cards"
import { cn } from "@/lib/utils"

interface CardRow {
  customer: CustomerCardsView
  card: CustomerCardsView["cards"][number]
}

/**
 * כרטיסיות — the front-desk console, as a searchable card list.
 *
 * A card-per-customer layout (rather than a table) so it stays usable on the
 * phone a clerk actually holds at the counter; each card's actions are labeled,
 * not icon-only, so a first-time user can tell what every button does.
 *
 * Cards are brand-global, so this searches every customer regardless of branch;
 * the `slug` it carries is only the acting branch, recorded on each punch. Search
 * runs live (debounced) and every mutation re-runs it so the balance the clerk
 * sees is always the live database value.
 */
function PunchCardsManager({
  slug,
  initial,
}: {
  slug: string
  initial: CustomerCardsView[]
}) {
  const t = useTranslations("admin.punchCards")
  const [query, setQuery] = useState("")
  const [results, setResults] = useState(initial)
  const [, startSearch] = useTransition()
  const [pending, start] = useTransition()
  const [showIssue, setShowIssue] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [removingSelected, setRemovingSelected] = useState(false)
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  const rows: CardRow[] = results.flatMap((customer) =>
    customer.cards.map((card) => ({ customer, card }))
  )

  const runSearch = (value: string) =>
    startSearch(async () => {
      setResults(await searchPunchCards({ slug, query: value }))
      setSelected(new Set())
    })

  // Start searching while typing, debounced so every keystroke isn't a request.
  const onSearchChange = (value: string) => {
    setQuery(value)
    if (debounce.current) clearTimeout(debounce.current)
    debounce.current = setTimeout(() => runSearch(value), 300)
  }

  const refresh = () => runSearch(query)

  const toggleRow = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const allSelected =
    rows.length > 0 && rows.every((row) => selected.has(row.card.id))

  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.card.id)))

  const deleteSelected = () =>
    start(async () => {
      await Promise.all(
        [...selected].map((cardId) => deleteCard({ slug, cardId }))
      )
      refresh()
    })

  return (
    <div className="space-y-5 pb-10">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-[26px] font-black text-brand-plum">
            {t("title")}
          </h1>
          <p className="mt-0.5 text-[14px] text-muted-foreground">
            {t("description")}
          </p>
        </div>
        <PillButton
          type="button"
          size="sm"
          onClick={() => setShowIssue((value) => !value)}
        >
          <Plus className="size-4" />
          {t("issueButton")}
        </PillButton>
      </header>

      {showIssue && (
        <IssueForm
          slug={slug}
          onIssued={(phone) => {
            setShowIssue(false)
            setQuery(phone)
            runSearch(phone)
          }}
        />
      )}

      <div className="relative">
        <Search className="pointer-events-none absolute end-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <AdminInput
          value={query}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t("searchPlaceholder")}
          aria-label={t("searchPlaceholder")}
          inputMode="tel"
          className="pe-10"
        />
      </div>

      {rows.length === 0 ? (
        <p className="py-12 text-center text-[15px] text-muted-foreground">
          {t("noResults")}
        </p>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="flex items-center gap-2 text-[14px] font-bold text-brand-plum">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                aria-label={t("selectAll")}
                className="size-4 accent-primary"
              />
              {t("selectAll")}
            </label>
            {selected.size > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-[14px] font-bold text-brand-plum">
                  {t("selectedCount", { count: selected.size })}
                </span>
                <button
                  type="button"
                  onClick={() => setRemovingSelected(true)}
                  disabled={pending}
                  className="flex h-9 items-center gap-1.5 rounded-full px-3 text-[14px] font-bold text-destructive transition hover:bg-destructive/10 disabled:opacity-40"
                >
                  <Trash2 className="size-4" />
                  {t("deleteSelected")}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {rows.map(({ customer, card }) => (
              <CardRowView
                key={card.id}
                slug={slug}
                customer={customer}
                card={card}
                selected={selected.has(card.id)}
                onToggle={() => toggleRow(card.id)}
                onChanged={refresh}
              />
            ))}
          </div>

          <ConfirmModal
            open={removingSelected}
            onClose={() => setRemovingSelected(false)}
            onConfirm={deleteSelected}
            title={t("deleteSelected")}
            message={t("deleteSelectedConfirm")}
            confirmLabel={t("deleteCard")}
          />
        </div>
      )}
    </div>
  )
}

/** One card row: summary + quick actions, with an inline edit panel. */
function CardRowView({
  slug,
  customer,
  card,
  selected,
  onToggle,
  onChanged,
}: {
  slug: string
  customer: CustomerCardsView
  card: CustomerCardsView["cards"][number]
  selected: boolean
  onToggle: () => void
  onChanged: () => void
}) {
  const t = useTranslations("admin.punchCards")
  const [pending, start] = useTransition()
  const [copied, setCopied] = useState(false)
  const [editing, setEditing] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    total: "",
    note: "",
  })

  const remaining = remainingPunches(card.totalPunches, card.usedPunches)
  const cardPath = `/card/${card.token}`

  const copyLink = async () => {
    await navigator.clipboard.writeText(
      new URL(cardPath, window.location.origin).href
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const startEdit = () => {
    setForm({
      fullName: customer.fullName,
      email: customer.email ?? "",
      total: String(card.totalPunches),
      note: card.note ?? "",
    })
    setEditing(true)
  }

  const saveEdit = () =>
    start(async () => {
      await updateCustomerDetails({
        slug,
        customerId: customer.id,
        fullName: form.fullName,
        email: form.email,
      })
      await updateCardDetails({
        slug,
        cardId: card.id,
        totalPunches: Number(form.total),
        note: form.note,
      })
      onChanged()
      setEditing(false)
    })

  const remove = () =>
    start(async () => {
      await deleteCard({ slug, cardId: card.id })
      onChanged()
    })

  return (
    <AdminCard className="p-4">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          aria-label={t("selectRow")}
          className="mt-1.5 size-4 flex-none accent-primary"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
            <span className="font-heading text-[17px] font-black text-brand-plum">
              {customer.fullName || "—"}
            </span>
            <span dir="ltr" className="text-[13px] text-muted-foreground">
              {customer.phone}
            </span>
            {customer.email && (
              <span dir="ltr" className="text-[13px] text-muted-foreground">
                {customer.email}
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[14px]">
            <span className="font-bold text-brand-plum">
              {t("cardSummary", { remaining, total: card.totalPunches })}
            </span>
            {remaining === 0 && (
              <span className="rounded-full bg-brand-lavender-soft px-2 py-0.5 text-[12px] font-bold text-brand-plum">
                {t("completedBadge")}
              </span>
            )}
            {card.issuedByLocationName && (
              <span className="text-[13px] text-muted-foreground">
                {card.issuedByLocationName}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <PillButton
          type="button"
          size="md"
          disabled={pending || remaining === 0}
          title={t("punchTip")}
          onClick={() =>
            start(async () => {
              await punchCard({ slug, cardId: card.id })
              onChanged()
            })
          }
          className="h-9 px-5 text-[14px]"
        >
          {remaining === 0 ? t("cardFull") : t("punch")}
        </PillButton>
        <ActionChip
          icon={<Minus className="size-4" />}
          label={t("undo")}
          tooltip={t("undoTip")}
          onClick={() =>
            start(async () => {
              await undoLastPunch({ slug, cardId: card.id })
              onChanged()
            })
          }
          disabled={pending || card.usedPunches === 0}
        />
        <ActionChip
          icon={
            copied ? <Check className="size-4" /> : <Copy className="size-4" />
          }
          label={copied ? t("copied") : t("copyLink")}
          tooltip={t("copyLinkTip")}
          onClick={copyLink}
        />
        <ActionChip
          icon={<ExternalLink className="size-4" />}
          label={t("openCard")}
          tooltip={t("openCardTip")}
          href={cardPath}
        />
        <ActionChip
          icon={<Pencil className="size-4" />}
          label={t("edit")}
          tooltip={t("editTip")}
          onClick={startEdit}
          active={editing}
        />
        <ActionChip
          icon={<Trash2 className="size-4" />}
          label={t("deleteCard")}
          tooltip={t("deleteCardTip")}
          onClick={() => setRemoving(true)}
          danger
        />
      </div>

      {editing && (
        <div className="mt-4 border-t border-border pt-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <AdminField label={t("fullName")}>
              <AdminInput
                value={form.fullName}
                onChange={(event) =>
                  setForm((f) => ({ ...f, fullName: event.target.value }))
                }
              />
            </AdminField>
            <AdminField label={t("email")}>
              <AdminInput
                type="email"
                dir="ltr"
                value={form.email}
                onChange={(event) =>
                  setForm((f) => ({ ...f, email: event.target.value }))
                }
              />
            </AdminField>
            <AdminField label={t("total")} tooltip={t("editTotalTip")}>
              <AdminInput
                type="number"
                min={1}
                max={100}
                value={form.total}
                onChange={(event) =>
                  setForm((f) => ({ ...f, total: event.target.value }))
                }
              />
            </AdminField>
            <AdminField label={t("note")} tooltip={t("noteTip")}>
              <AdminInput
                value={form.note}
                onChange={(event) =>
                  setForm((f) => ({ ...f, note: event.target.value }))
                }
              />
            </AdminField>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <PillButton
              type="button"
              size="md"
              disabled={pending}
              onClick={saveEdit}
              className="h-9"
            >
              {t("save")}
            </PillButton>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="flex h-9 items-center rounded-full px-3 text-[14px] font-bold text-muted-foreground transition hover:bg-muted"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        open={removing}
        onClose={() => setRemoving(false)}
        onConfirm={remove}
        title={customer.fullName || customer.phone}
        message={t("deleteConfirm")}
        confirmLabel={t("deleteCard")}
      />
    </AdminCard>
  )
}

/**
 * A labeled action button (or link when `href` is given).
 *
 * The `icon` and `label` are both shown, so each action reads clearly without
 * needing to be learned — the fix for a row of ambiguous icon-only buttons.
 * `tooltip` adds a longer one-line explanation on hover via a native `title`.
 */
function ActionChip({
  icon,
  label,
  tooltip,
  onClick,
  href,
  disabled,
  danger,
  active,
}: {
  icon: React.ReactNode
  label: string
  tooltip?: string
  onClick?: () => void
  href?: string
  disabled?: boolean
  danger?: boolean
  active?: boolean
}) {
  const className = cn(
    "inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-bold transition disabled:opacity-40",
    danger
      ? "text-destructive hover:bg-destructive/10"
      : "text-brand-plum hover:bg-muted",
    active && "bg-muted"
  )

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title={tooltip}
        className={className}
      >
        {icon}
        {label}
      </a>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={className}
    >
      {icon}
      {label}
    </button>
  )
}

/** Issue a fresh card, or migrate a physical one by setting remaining below total. */
function IssueForm({
  slug,
  onIssued,
}: {
  slug: string
  onIssued: (phone: string) => void
}) {
  const t = useTranslations("admin.punchCards")
  const [pending, start] = useTransition()
  const toast = useToast()

  return (
    <AdminCard title={t("issueTitle")} description={t("issueDescription")}>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          const form = event.currentTarget
          const data = new FormData(form)
          const phone = String(data.get("phone") ?? "").trim()
          const total = Number(data.get("total"))
          const remainingRaw = String(data.get("remaining") ?? "").trim()
          const remaining = remainingRaw === "" ? total : Number(remainingRaw)

          start(async () => {
            const result = await issuePunchCard({
              slug,
              phone,
              fullName: String(data.get("fullName") ?? "").trim(),
              email: String(data.get("email") ?? "").trim(),
              note: String(data.get("note") ?? "").trim(),
              totalPunches: total,
              remainingPunches: remaining,
            })
            if (result.ok) {
              form.reset()
              onIssued(phone)
            } else {
              toast(t("issueError"), "error")
            }
          })
        }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AdminField label={t("phone")}>
          <AdminInput name="phone" required inputMode="tel" dir="ltr" />
        </AdminField>
        <AdminField label={t("fullName")}>
          <AdminInput name="fullName" />
        </AdminField>
        <AdminField label={t("email")}>
          <AdminInput name="email" type="email" dir="ltr" />
        </AdminField>
        <AdminField label={t("note")} tooltip={t("noteTip")}>
          <AdminInput name="note" />
        </AdminField>
        <AdminField label={t("total")} tooltip={t("totalTip")}>
          <AdminInput
            name="total"
            type="number"
            min={1}
            max={100}
            defaultValue={10}
            required
          />
        </AdminField>
        <AdminField label={t("remaining")} tooltip={t("remainingTip")}>
          <AdminInput
            name="remaining"
            type="number"
            min={0}
            placeholder={t("remainingPlaceholder")}
          />
        </AdminField>

        <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-3">
          <PillButton type="submit" size="sm" disabled={pending}>
            {t("issueButton")}
          </PillButton>
        </div>
      </form>
    </AdminCard>
  )
}

export { PunchCardsManager }
