"use client"

import { useTranslations } from "next-intl"
import { Heart } from "lucide-react"

import { Reveal } from "@/components/brand/reveal"
import { remainingPunches } from "@/lib/punch-cards"
import { cn } from "@/lib/utils"

interface PunchCardDisplayProps {
  total: number
  used: number
  /** Greeting name, shown on the customer's own view. */
  customerName?: string
  /** Branch the card was issued at, if known. */
  branchName?: string | null
  /** Free note (e.g. a physical-card migration marker). */
  note?: string | null
  className?: string
}

/**
 * The visual punch card, shared by the customer's `/card/<token>` view and the
 * admin manager. It is a dumb component: totals and names come in as plain
 * values (a page resolves them) while its own labels come from `messages` via
 * `useTranslations`, exactly like the other brand components.
 */
function PunchCardDisplay({
  total,
  used,
  customerName,
  branchName,
  note,
  className,
}: PunchCardDisplayProps) {
  const t = useTranslations("punchCard")
  const remaining = remainingPunches(total, used)
  const isComplete = remaining === 0

  return (
    <div
      className={cn(
        "rounded-[26px] border border-border bg-brand-cloud p-6 md:p-8",
        className
      )}
    >
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-heading text-[22px] font-black text-brand-plum">
          {customerName
            ? t("greeting", { name: customerName })
            : t("cardTitle")}
        </h2>
        <span className="text-[14px] font-bold text-muted-foreground">
          {t("usedOfTotal", { used, total })}
        </span>
      </div>

      <ul
        className="grid grid-cols-5 gap-3 sm:grid-cols-6"
        aria-label={t("usedOfTotal", { used, total })}
      >
        {Array.from({ length: total }, (_, index) => {
          const filled = index < used
          return (
            <Reveal
              as="li"
              key={index}
              delay={index * 40}
              className={cn(
                "flex aspect-square items-center justify-center rounded-full transition-colors",
                filled
                  ? "bg-brand-lavender text-white"
                  : "border-2 border-dashed border-border bg-white text-transparent"
              )}
              aria-label={filled ? t("slotFilled") : t("slotEmpty")}
            >
              <Heart className="size-5" fill="currentColor" aria-hidden />
            </Reveal>
          )
        })}
      </ul>

      <div className="mt-6 rounded-[20px] bg-brand-lavender-soft px-5 py-4 text-center">
        {isComplete ? (
          <p className="animate-baloona-float font-heading text-[18px] font-black text-brand-plum">
            {t("completed")}
          </p>
        ) : (
          <p className="text-[16px] text-brand-ink-soft">
            {t.rich("remaining", {
              count: remaining,
              strong: (chunks) => (
                <strong className="font-heading text-[20px] font-black text-brand-plum">
                  {chunks}
                </strong>
              ),
            })}
          </p>
        )}
      </div>

      {(branchName || note) && (
        <div className="mt-4 space-y-1 text-center text-[13px] text-muted-foreground">
          {branchName && <p>{t("issuedBy", { branch: branchName })}</p>}
          {note && <p>{note}</p>}
        </div>
      )}
    </div>
  )
}

export { PunchCardDisplay }
