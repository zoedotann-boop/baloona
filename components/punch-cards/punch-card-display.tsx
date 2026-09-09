"use client"

import { useTranslations } from "next-intl"

import { PunchCardArt } from "@/components/shop/punch-card-art"
import { remainingPunches } from "@/lib/punch-cards"
import { cn } from "@/lib/utils"

interface PunchEntry {
  id: string
  at: string
  branch?: string | null
}

interface PunchCardDisplayProps {
  total: number
  used: number
  punches?: PunchEntry[]
  customerName?: string
  branchName?: string | null
  note?: string | null
  className?: string
}

function PunchCardDisplay({
  total,
  used,
  punches = [],
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
        "overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-border",
        className
      )}
    >
      <PunchCardArt
        theme="age12"
        caption={t("cardCaption")}
        used={Math.min(used, 10)}
      />

      <div className="px-6 py-6 text-center">
        <h1 className="font-heading text-[22px] font-black text-brand-plum">
          {customerName
            ? t("greeting", { name: customerName })
            : t("cardTitle")}
        </h1>
        <p className="mt-1 text-[14px] font-bold text-brand-rose-ink/70">
          {t("usedOfTotal", { used, total })}
        </p>

        <div className="mt-4 rounded-[20px] bg-brand-pink-soft px-5 py-4">
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

        {punches.length > 0 && (
          <div className="mt-4 rounded-[20px] bg-brand-pink-soft/60 px-5 py-4 text-right">
            <h2 className="font-heading text-[15px] font-black text-brand-plum">
              {t("historyTitle")}
            </h2>
            <ol className="mt-2 space-y-1">
              {punches.map((punch, index) => (
                <li
                  key={punch.id}
                  className="flex items-start justify-between gap-3 text-[13px] text-brand-rose-ink/80"
                >
                  <span className="font-bold text-brand-plum">
                    {t("punchNumber", { number: index + 1 })}
                  </span>
                  <span className="flex flex-col items-end gap-0.5">
                    <time className="tabular-nums">{punch.at}</time>
                    {punch.branch && (
                      <span className="text-[11px] text-brand-rose-ink/60">
                        {t("punchBranch", { branch: punch.branch })}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {(branchName || note) && (
          <div className="mt-4 space-y-1 text-[13px] text-brand-rose-ink/70">
            {branchName && <p>{t("issuedBy", { branch: branchName })}</p>}
            {note && <p>{note}</p>}
          </div>
        )}
      </div>
    </div>
  )
}

export { PunchCardDisplay }
