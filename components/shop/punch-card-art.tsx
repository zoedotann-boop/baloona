import { cn } from "@/lib/utils"

import {
  CartisiaBalloon,
  CartisiaBalloonSmall,
  CartisiaCloudBlue,
  CartisiaCloudBlueLow,
  CartisiaCloudPink,
  CartisiaCloudWhite,
  CartisiaCloudWhiteLow,
  CartisiaFlamingo,
  CartisiaLogo,
} from "./cartisia-motifs"

type PunchCardTheme = "age12" | "age2"

interface PunchCardArtProps {
  theme: PunchCardTheme
  caption: string
  subcaption?: string
  total: number
  used?: number
  className?: string
}

const CARD_W = 600
const ART_H = 1036
const SLOT_W = 219
const SLOT_H = 70
const X_LEFT = 76
const X_RIGHT = 320
const FIRST_ROW_Y = 346
const ROW_STEP = 88
const BOTTOM_PAD = 282
const ROWS_PER_COLUMN = 5
const MAX_SLOTS = ROWS_PER_COLUMN * 2
const MIN_HEIGHT_ROWS = 2

type SlotSide = "left" | "right"

interface SlotPosition {
  number: number
  x: number
  y: number
  side: SlotSide
}

function layoutSlots(total: number) {
  const count = Math.min(Math.max(Math.floor(total), 1), MAX_SLOTS)
  const columns: { x: number; side: SlotSide }[] =
    count > ROWS_PER_COLUMN
      ? [
          { x: X_RIGHT, side: "right" },
          { x: X_LEFT, side: "left" },
        ]
      : [{ x: (CARD_W - SLOT_W) / 2, side: "right" }]
  const rows = Math.ceil(count / columns.length)
  const slots: SlotPosition[] = []
  columns.forEach(({ x, side }) => {
    const size = Math.min(rows, count - slots.length)
    const top = FIRST_ROW_Y + ((rows - size) * ROW_STEP) / 2
    for (let row = 0; row < size; row++) {
      slots.push({ number: slots.length + 1, x, y: top + row * ROW_STEP, side })
    }
  })
  const height =
    FIRST_ROW_Y + (Math.max(rows, MIN_HEIGHT_ROWS) - 1) * ROW_STEP + BOTTOM_PAD
  return { slots, height }
}

interface ThemeArt {
  background: string
  slot: string
  punchedSlot: string
  top: React.ReactNode
  bottom: React.ReactNode
}

const PINK: ThemeArt = {
  background: "#f6c9c8",
  slot: "#ff9699",
  punchedSlot: "#ef5a63",
  top: (
    <>
      <CartisiaCloudPink
        x={70}
        y={-20}
        width={250}
        height={165}
        overflow="visible"
      />
      <CartisiaCloudWhite
        x={350}
        y={-25}
        width={240}
        height={180}
        overflow="visible"
      />
    </>
  ),
  bottom: (
    <>
      <path
        d="M0 828C150 806 300 858 430 928 500 966 555 972 600 970L600 1036 0 1036Z"
        fill="#a3ebc7"
      />
      <path
        d="M0 928C120 892 230 946 350 930 470 914 545 928 600 946L600 1036 0 1036Z"
        fill="#c4f2dc"
      />
      <CartisiaFlamingo
        x={203}
        y={605}
        width={236}
        height={364}
        overflow="visible"
      />
    </>
  ),
}

const BLUE: ThemeArt = {
  background: "#a6dbf4",
  slot: "#d8f5ff",
  punchedSlot: "#4bb6e8",
  top: (
    <>
      <CartisiaCloudBlue
        x={300}
        y={-30}
        width={280}
        height={200}
        overflow="visible"
      />
      <CartisiaCloudWhite
        x={40}
        y={-20}
        width={200}
        height={150}
        overflow="visible"
      />
    </>
  ),
  bottom: (
    <>
      <CartisiaCloudWhiteLow
        x={40}
        y={812}
        width={300}
        height={224}
        preserveAspectRatio="xMidYMid slice"
      />
      <CartisiaCloudBlueLow
        x={300}
        y={812}
        width={300}
        height={224}
        preserveAspectRatio="xMidYMid slice"
      />
      <CartisiaBalloon
        x={275}
        y={770}
        width={150}
        height={225}
        overflow="visible"
      />
      <CartisiaBalloonSmall
        x={180}
        y={780}
        width={90}
        height={126}
        overflow="visible"
      />
    </>
  ),
}

const THEMES: Record<PunchCardTheme, ThemeArt> = { age12: PINK, age2: BLUE }

const punchCardThemeBackground: Record<PunchCardTheme, string> = {
  age12: PINK.background,
  age2: BLUE.background,
}

interface SlotProps extends SlotPosition {
  fill: string
  punchedFill: string
  punched: boolean
}

function Slot({ x, y, side, fill, punchedFill, number, punched }: SlotProps) {
  const inset = SLOT_H * 0.62
  const tokenCx = side === "left" ? x + inset : x + SLOT_W - inset
  const checkCx = side === "left" ? x + SLOT_W - inset : x + inset
  return (
    <>
      <rect
        x={x}
        y={y - SLOT_H / 2}
        width={SLOT_W}
        height={SLOT_H}
        rx={SLOT_H / 2}
        fill={punched ? punchedFill : fill}
      />
      {punched && (
        <path
          d={`M${checkCx - 13} ${y} l8 9 l16 -19`}
          fill="none"
          stroke="#ffffff"
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      <circle cx={tokenCx} cy={y} r={SLOT_H * 0.34} fill="#ffffff" />
      <text
        x={tokenCx}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-heading)"
        fontWeight={600}
        fontSize={SLOT_H * 0.5}
        fill="var(--brand-ink)"
      >
        {number}
      </text>
    </>
  )
}

function PunchCardArt({
  theme,
  caption,
  subcaption,
  total,
  used = 0,
  className,
}: PunchCardArtProps) {
  const art = THEMES[theme]
  const { slots, height } = layoutSlots(total)
  return (
    <svg
      viewBox={`0 0 ${CARD_W} ${height}`}
      className={cn("block w-full", className)}
      role="presentation"
      aria-hidden
    >
      <rect width={CARD_W} height={height} fill={art.background} />
      {art.top}
      <g transform={`translate(0 ${height - ART_H})`}>{art.bottom}</g>
      <CartisiaLogo
        x={150}
        y={120}
        width={300}
        height={96}
        overflow="visible"
      />
      <text
        x={300}
        y={262}
        textAnchor="middle"
        direction="rtl"
        fontFamily="var(--font-sans)"
        fontWeight={700}
        fontSize={26}
        fill="var(--brand-ink)"
      >
        {caption}
      </text>
      {subcaption && (
        <text
          x={300}
          y={300}
          textAnchor="middle"
          direction="rtl"
          fontFamily="var(--font-sans)"
          fontWeight={700}
          fontSize={22}
          fill="var(--brand-ink)"
        >
          {subcaption}
        </text>
      )}
      {slots.map((slot) => (
        <Slot
          key={slot.number}
          {...slot}
          fill={art.slot}
          punchedFill={art.punchedSlot}
          punched={slot.number <= used}
        />
      ))}
    </svg>
  )
}

export { PunchCardArt, punchCardThemeBackground }
export type { PunchCardTheme }
