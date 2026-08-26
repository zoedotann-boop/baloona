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
  /** Which printed card design to reproduce — pink flamingo or blue balloons. */
  theme: PunchCardTheme
  /** Decorative sub-heading on the card, e.g. "כרטיסיית כניסה לילדים עד גיל 12". */
  caption: string
  className?: string
}

// The card is drawn in a 600×1036 space (the printed card's 1200×2072 ratio).
// Ten punch slots sit in two columns of five; numbers count 1–5 down the right
// column, 6–10 down the left, mirroring the physical card.
const SLOT_W = 219
const SLOT_H = 70
const X_LEFT = 76
const X_RIGHT = 320
const ROW_Y = [374, 462, 550, 638, 726]

interface ThemeArt {
  background: string
  slot: string
  top: React.ReactNode
  bottom: React.ReactNode
}

const PINK: ThemeArt = {
  background: "#f6c9c8",
  slot: "#ff9699",
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

interface SlotProps {
  y: number
  side: "left" | "right"
  fill: string
  number: number
}

/** One punch slot: the stadium pill, a white token at the outer end, its number. */
function Slot({ y, side, fill, number }: SlotProps) {
  const x = side === "left" ? X_LEFT : X_RIGHT
  const cx = side === "left" ? x + SLOT_H * 0.62 : x + SLOT_W - SLOT_H * 0.62
  return (
    <>
      <rect
        x={x}
        y={y - SLOT_H / 2}
        width={SLOT_W}
        height={SLOT_H}
        rx={SLOT_H / 2}
        fill={fill}
      />
      <circle cx={cx} cy={y} r={SLOT_H * 0.34} fill="#ffffff" />
      <text
        x={cx}
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

/**
 * The illustrated Baloona punch card, rebuilt from the printed card's own vector
 * art (see {@link file://./cartisia-motifs.tsx}) so it scales crisply and ships
 * with no image payload. Purely decorative — the product name, price and CTA
 * live beside it — so the whole drawing is `aria-hidden`.
 */
function PunchCardArt({ theme, caption, className }: PunchCardArtProps) {
  const art = THEMES[theme]
  return (
    <svg
      viewBox="0 0 600 1036"
      className={cn("block w-full", className)}
      role="presentation"
      aria-hidden
    >
      <rect width={600} height={1036} fill={art.background} />
      {art.top}
      {art.bottom}
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
      {ROW_Y.map((y, index) => (
        <Slot
          key={`r${y}`}
          y={y}
          side="right"
          fill={art.slot}
          number={index + 1}
        />
      ))}
      {ROW_Y.map((y, index) => (
        <Slot
          key={`l${y}`}
          y={y}
          side="left"
          fill={art.slot}
          number={index + 6}
        />
      ))}
    </svg>
  )
}

export { PunchCardArt }
export type { PunchCardTheme }
