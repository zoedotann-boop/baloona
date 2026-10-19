"use client"

import { useTranslations } from "next-intl"

import {
  PunchCardArt,
  type PunchCardTheme,
} from "@/components/shop/punch-card-art"

interface PunchCardFaceProps {
  theme: PunchCardTheme
  total: number
  used: number
  className?: string
}

function PunchCardFace({ theme, total, used, className }: PunchCardFaceProps) {
  const t = useTranslations("punchCard")
  return (
    <PunchCardArt
      theme={theme}
      caption={t("cardCaption", { total })}
      subcaption={theme === "age2" ? t("cardTypeAge2") : t("cardTypeAge12")}
      total={total}
      used={used}
      className={className}
    />
  )
}

export { PunchCardFace }
