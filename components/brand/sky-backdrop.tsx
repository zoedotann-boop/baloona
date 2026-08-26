import {
  Cloud,
  Flamingo,
  Heart,
  Hills,
  HotAirBalloon,
  PartyBalloon,
} from "@/components/brand/motifs"
import { cn } from "@/lib/utils"

// A fixed, hand-placed sky of Baloona motifs — the same cast as the printed
// signage. Positions are percentages so it scales with the layer; no randomness
// keeps the SSR/CSR output stable and the a11y snapshot deterministic.
const CLOUDS = [
  { top: "8%", left: "6%", w: 130, o: 0.9 },
  { top: "22%", left: "74%", w: 170, o: 0.8 },
  { top: "62%", left: "12%", w: 150, o: 0.7 },
]

const BALLOONS = [
  {
    top: "12%",
    left: "82%",
    h: 120,
    color: "var(--brand-rose)",
    pattern: "dots",
  },
  {
    top: "40%",
    left: "8%",
    h: 100,
    color: "var(--brand-lavender)",
    pattern: "scallop",
  },
  {
    top: "6%",
    left: "40%",
    h: 84,
    color: "var(--brand-mint)",
    pattern: "none",
  },
] as const

const HEARTS = [
  { top: "30%", left: "60%", w: 22, fill: "var(--brand-rose)" },
  { top: "70%", left: "84%", w: 16, fill: "var(--brand-flower-pink)" },
]

interface SkyBackdropProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * `"sky"` (default) floats hot-air balloons; `"party"` swaps them for round
   * party balloons — the birthday flavour.
   */
  variant?: "sky" | "party"
  /** Add the mint hills + flamingo along the bottom edge (the punch-card scene). */
  ground?: boolean
}

/**
 * A soft sky of clouds, balloons and hearts as a decorative background layer.
 * Drop inside a `relative overflow-hidden` element; renders behind content via
 * `-z-10`, purely ornamental (`aria-hidden`).
 */
function SkyBackdrop({
  variant = "sky",
  ground = false,
  className,
  ...props
}: SkyBackdropProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className
      )}
      {...props}
    >
      {CLOUDS.map((c, i) => (
        <Cloud
          key={`c${i}`}
          className="absolute"
          style={{ top: c.top, left: c.left, width: c.w, opacity: c.o }}
        />
      ))}
      {BALLOONS.map((b, i) =>
        variant === "party" ? (
          <PartyBalloon
            key={`b${i}`}
            color={b.color}
            className="absolute"
            style={{ top: b.top, left: b.left, height: b.h }}
          />
        ) : (
          <HotAirBalloon
            key={`b${i}`}
            color={b.color}
            pattern={b.pattern}
            className="absolute"
            style={{ top: b.top, left: b.left, height: b.h }}
          />
        )
      )}
      {HEARTS.map((h, i) => (
        <Heart
          key={`h${i}`}
          fill={h.fill}
          className="absolute"
          style={{ top: h.top, left: h.left, width: h.w }}
        />
      ))}
      {ground && (
        <>
          <Hills className="absolute inset-x-0 bottom-0 h-24 w-full opacity-90" />
          <Flamingo className="absolute bottom-2 left-[8%] h-28 opacity-90" />
        </>
      )}
    </div>
  )
}

export { SkyBackdrop }
