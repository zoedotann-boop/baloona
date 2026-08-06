"use client"

import { useTranslations } from "next-intl"
import { Check, Copy, ExternalLink, Minus, Search } from "lucide-react"
import { useState, useTransition } from "react"

import { AdminCard, AdminField, AdminInput } from "@/components/admin/admin-ui"
import { PillButton } from "@/components/brand/pill-button"
import { PunchCardDisplay } from "@/components/punch-cards/punch-card-display"
import {
  issuePunchCard,
  punchCard,
  searchPunchCards,
  undoLastPunch,
} from "@/lib/actions/admin/punch-cards"
import { remainingPunches, type CustomerCardsView } from "@/lib/punch-cards"

/**
 * כרטיסיות — the front-desk console.
 *
 * Cards are brand-global, so this searches every customer regardless of branch;
 * the `slug` it carries is only the acting branch, recorded on each punch. Every
 * mutation re-runs the current search so the balance the clerk sees is always
 * the live database value.
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
  const [searching, startSearch] = useTransition()

  const runSearch = (value: string) =>
    startSearch(async () => {
      setResults(await searchPunchCards({ slug, query: value }))
    })

  return (
    <div className="space-y-6 pb-10">
      <header>
        <h1 className="font-heading text-[28px] font-black text-brand-plum">
          {t("title")}
        </h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          {t("description")}
        </p>
      </header>

      <IssueForm
        slug={slug}
        onIssued={(phone) => {
          setQuery(phone)
          runSearch(phone)
        }}
      />

      <AdminCard title={t("searchTitle")}>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            runSearch(query)
          }}
          className="flex gap-2"
        >
          <AdminInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchPlaceholder")}
            inputMode="tel"
          />
          <PillButton
            type="submit"
            variant="primary"
            size="md"
            disabled={searching}
          >
            <Search className="size-4" />
            {t("searchButton")}
          </PillButton>
        </form>
      </AdminCard>

      {results.length === 0 ? (
        <p className="py-12 text-center text-[15px] text-muted-foreground">
          {t("noResults")}
        </p>
      ) : (
        <div className="space-y-4">
          {results.map((customer) => (
            <CustomerRow
              key={customer.id}
              customer={customer}
              slug={slug}
              onChanged={() => runSearch(query)}
            />
          ))}
        </div>
      )}
    </div>
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
  const [error, setError] = useState(false)

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

          setError(false)
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
              setError(true)
            }
          })
        }}
        className="grid gap-4 sm:grid-cols-2"
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

        <div className="flex items-center gap-3 sm:col-span-2">
          <PillButton
            type="submit"
            variant="primary"
            size="md"
            disabled={pending}
          >
            {t("issueButton")}
          </PillButton>
          {error && (
            <span className="text-[14px] font-bold text-destructive">
              {t("issueError")}
            </span>
          )}
        </div>
      </form>
    </AdminCard>
  )
}

function CustomerRow({
  customer,
  slug,
  onChanged,
}: {
  customer: CustomerCardsView
  slug: string
  onChanged: () => void
}) {
  return (
    <AdminCard>
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-heading text-[18px] font-black text-brand-plum">
          {customer.fullName || "—"}
        </span>
        <span dir="ltr" className="text-[14px] text-muted-foreground">
          {customer.phone}
        </span>
        {customer.email && (
          <span dir="ltr" className="text-[14px] text-muted-foreground">
            {customer.email}
          </span>
        )}
      </div>

      <div className="space-y-4">
        {customer.cards.map((card) => (
          <CardControls
            key={card.id}
            slug={slug}
            card={card}
            onChanged={onChanged}
          />
        ))}
      </div>
    </AdminCard>
  )
}

function CardControls({
  slug,
  card,
  onChanged,
}: {
  slug: string
  card: CustomerCardsView["cards"][number]
  onChanged: () => void
}) {
  const t = useTranslations("admin.punchCards")
  const [pending, start] = useTransition()
  const [copied, setCopied] = useState(false)

  const remaining = remainingPunches(card.totalPunches, card.usedPunches)
  const cardPath = `/card/${card.token}`

  const copyLink = async () => {
    await navigator.clipboard.writeText(
      new URL(cardPath, window.location.origin).href
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="rounded-[20px] border border-border bg-brand-cloud p-4">
      <PunchCardDisplay
        className="border-0 bg-transparent p-0"
        total={card.totalPunches}
        used={card.usedPunches}
        branchName={card.issuedByLocationName}
        note={card.note}
      />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <PillButton
          type="button"
          variant="primary"
          size="md"
          disabled={pending || remaining === 0}
          onClick={() =>
            start(async () => {
              await punchCard({ slug, cardId: card.id })
              onChanged()
            })
          }
        >
          {remaining === 0 ? t("cardFull") : t("punch")}
        </PillButton>

        <button
          type="button"
          disabled={pending || card.usedPunches === 0}
          onClick={() =>
            start(async () => {
              await undoLastPunch({ slug, cardId: card.id })
              onChanged()
            })
          }
          className="flex h-9 items-center gap-1.5 rounded-full px-3 text-[14px] font-bold text-muted-foreground transition hover:bg-muted disabled:opacity-40"
        >
          <Minus className="size-4" />
          {t("undo")}
        </button>

        <button
          type="button"
          onClick={copyLink}
          className="flex h-9 items-center gap-1.5 rounded-full px-3 text-[14px] font-bold text-brand-plum transition hover:bg-muted"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? t("copied") : t("copyLink")}
        </button>

        <a
          href={cardPath}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 items-center gap-1.5 rounded-full px-3 text-[14px] font-bold text-brand-plum transition hover:bg-muted"
        >
          <ExternalLink className="size-4" />
          {t("openCard")}
        </a>
      </div>
    </div>
  )
}

export { PunchCardsManager }
