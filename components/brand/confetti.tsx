import { cn } from "@/lib/utils"

// A fixed, hand-authored scatter of rounded pastel squares (no Math.random —
// keeps SSR/CSR output stable and the a11y snapshot deterministic). Positions
// are percentages of the layer.
const PIECES = [
  { top: "10%", left: "6%", size: 44, color: "bg-brand-lavender", rotate: -14 },
  { top: "20%", left: "88%", size: 34, color: "bg-brand-banana", rotate: 12 },
  { top: "6%", left: "58%", size: 22, color: "bg-brand-mint", rotate: 20 },
  { top: "44%", left: "14%", size: 26, color: "bg-brand-rose", rotate: -8 },
  { top: "74%", left: "9%", size: 38, color: "bg-brand-banana", rotate: 16 },
  {
    top: "80%",
    left: "86%",
    size: 30,
    color: "bg-brand-lavender",
    rotate: -18,
  },
  { top: "58%", left: "92%", size: 22, color: "bg-brand-mint", rotate: 10 },
  { top: "86%", left: "44%", size: 24, color: "bg-brand-pink", rotate: -12 },
  { top: "30%", left: "40%", size: 18, color: "bg-brand-rose", rotate: 24 },
  { top: "64%", left: "68%", size: 28, color: "bg-brand-pink", rotate: -20 },
]

/**
 * Scattered pastel rounded squares as a decorative background layer. Drop inside
 * a `relative overflow-hidden` section; renders behind content via `-z-10`.
 */
function Confetti({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className
      )}
      {...props}
    >
      {PIECES.map((p, i) => (
        <span
          key={i}
          className={cn("absolute rounded-[8px]", p.color)}
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  )
}

export { Confetti }
