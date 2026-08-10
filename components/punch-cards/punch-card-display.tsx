"use client"

import { useTranslations } from "next-intl"

import { BalloonClusterIcon } from "@/components/brand/balloon-cluster-icon"
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
  /** `"md"` is the customer view; `"sm"` is the denser admin view. */
  size?: "sm" | "md"
  /** Hide the title row (the admin already shows the customer + summary). */
  showHeader?: boolean
  className?: string
}

/**
 * The visual punch card, shared by the customer's `/card/<token>` view and the
 * admin console — styled as the same postage stamp the shop sells: a solid
 * purple perforated frame around a white card, with flower punch-marks (filled
 * for used punches, faded for the ones still to collect). Dumb component; the
 * page resolves the values and the labels come from `messages`.
 */
function PunchCardDisplay({
  total,
  used,
  customerName,
  branchName,
  note,
  size = "md",
  showHeader = true,
  className,
}: PunchCardDisplayProps) {
  const t = useTranslations("punchCard")
  const remaining = remainingPunches(total, used)
  const isComplete = remaining === 0
  const compact = size === "sm"

  return (
    // Two-layer stamp: a purple stamp whose padding shows as a solid perforated
    // frame around the white inner card (matching the shop cards).
    <div className={cn("stamp-edge bg-accent p-[3px]", className)}>
      <div
        className={cn(
          "stamp-edge bg-white text-center",
          compact ? "p-4" : "p-6 md:p-8"
        )}
      >
        {showHeader && (
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2 text-start">
            <h2
              className={cn(
                "font-heading font-black text-brand-plum",
                compact ? "text-[16px]" : "text-[22px]"
              )}
            >
              {customerName
                ? t("greeting", { name: customerName })
                : t("cardTitle")}
            </h2>
            <span className="text-[14px] font-bold text-muted-foreground">
              {t("usedOfTotal", { used, total })}
            </span>
          </div>
        )}

        <ul
          className="flex flex-wrap justify-center gap-1.5"
          aria-label={t("usedOfTotal", { used, total })}
        >
          {Array.from({ length: total }, (_, index) => {
            const punched = index < used
            return (
              <li
                key={index}
                aria-label={punched ? t("slotFilled") : t("slotEmpty")}
              >
                <BalloonClusterIcon
                  color="var(--brand-lavender)"
                  size={compact ? 20 : 26}
                  solidCenter={!punched}
                />
              </li>
            )
          })}
        </ul>

        <div
          className={cn(
            "bg-brand-lavender-soft text-center",
            compact
              ? "mt-4 rounded-[16px] px-4 py-2.5"
              : "mt-6 rounded-[20px] px-5 py-4"
          )}
        >
          {isComplete ? (
            <p
              className={cn(
                "animate-baloona-float font-heading font-black text-brand-plum",
                compact ? "text-[15px]" : "text-[18px]"
              )}
            >
              {t("completed")}
            </p>
          ) : (
            <p
              className={cn(
                "text-brand-ink-soft",
                compact ? "text-[14px]" : "text-[16px]"
              )}
            >
              {t.rich("remaining", {
                count: remaining,
                strong: (chunks) => (
                  <strong
                    className={cn(
                      "font-heading font-black text-brand-plum",
                      compact ? "text-[16px]" : "text-[20px]"
                    )}
                  >
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
    </div>
  )
}

export { PunchCardDisplay }
