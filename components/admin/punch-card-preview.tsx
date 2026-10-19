"use client"

import { useTranslations } from "next-intl"

import { PunchCardFace } from "@/components/punch-cards/punch-card-face"
import { type PunchCardTheme } from "@/components/shop/punch-card-art"
import { cn } from "@/lib/utils"

interface PunchCardPreviewProps {
  theme: PunchCardTheme
  total: number
  used: number
  className?: string
}

function PunchCardPreview({
  theme,
  total,
  used,
  className,
}: PunchCardPreviewProps) {
  const t = useTranslations("admin.punchCards")
  return (
    <figure className={cn("w-40 flex-none", className)}>
      <figcaption className="mb-1.5 text-[13px] font-bold text-brand-plum">
        {t("preview")}
      </figcaption>
      <div className="overflow-hidden rounded-[18px] shadow-sm ring-1 ring-border">
        <PunchCardFace theme={theme} total={total} used={used} />
      </div>
    </figure>
  )
}

export { PunchCardPreview }
