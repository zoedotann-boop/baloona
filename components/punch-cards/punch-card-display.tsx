"use client"

import { Check } from "lucide-react"
import { useTranslations } from "next-intl"

import { Cloud, Flamingo, Hills } from "@/components/brand/motifs"
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
 * admin console. It mirrors the printed Baloona entry card the front desk hands
 * out: a pink sky with a cloud and a flamingo on the mint hills, and two columns
 * of numbered entry slots that fill in as they are punched. Dumb component — the
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
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px] bg-brand-pink",
        compact ? "px-4 pt-4 pb-16" : "px-6 pt-6 pb-24 md:px-8",
        className
      )}
    >
      {/* Printed-card scenery — a cloud in the sky and the flamingo standing on
          the hills along the bottom edge. Purely decorative. */}
      <Cloud
        className={cn(
          "absolute start-4 -top-2 opacity-90",
          compact ? "w-16" : "w-24"
        )}
      />
      <Hills className="absolute inset-x-0 bottom-0 h-16 w-full" />
      <Flamingo
        className={cn("absolute end-4 bottom-1", compact ? "h-16" : "h-24")}
      />

      <div className="relative">
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
            <span className="text-[14px] font-bold text-brand-rose-ink/70">
              {t("usedOfTotal", { used, total })}
            </span>
          </div>
        )}

        <ul
          className="grid grid-cols-2 gap-2"
          aria-label={t("usedOfTotal", { used, total })}
        >
          {Array.from({ length: total }, (_, index) => {
            const punched = index < used
            return (
              <li
                key={index}
                aria-label={punched ? t("slotFilled") : t("slotEmpty")}
                className={cn(
                  "flex items-center gap-2 rounded-full ps-1.5 pe-3",
                  compact ? "py-1" : "py-1.5",
                  punched
                    ? "bg-brand-rose text-white"
                    : "bg-white/55 text-brand-rose"
                )}
              >
                <span
                  className={cn(
                    "grid shrink-0 place-items-center rounded-full bg-white font-heading font-black text-brand-rose-ink",
                    compact ? "size-6 text-[12px]" : "size-7 text-[14px]"
                  )}
                >
                  {index + 1}
                </span>
                {punched && <Check className="size-4" strokeWidth={3} />}
              </li>
            )
          })}
        </ul>

        <div
          className={cn(
            "bg-white/70 text-center backdrop-blur-[1px]",
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
          <div className="mt-4 space-y-1 text-center text-[13px] text-brand-rose-ink/70">
            {branchName && <p>{t("issuedBy", { branch: branchName })}</p>}
            {note && <p>{note}</p>}
          </div>
        )}
      </div>
    </div>
  )
}

export { PunchCardDisplay }
