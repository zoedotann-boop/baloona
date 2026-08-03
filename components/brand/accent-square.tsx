import { cn } from "@/lib/utils"

interface AccentSquareProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Fill color as a token utility class, e.g. "bg-brand-lavender". */
  color?: string
  /** Size in pixels (square). */
  size?: number
  /** Rotation in degrees. */
  rotate?: number
}

/**
 * Decorative rounded square that peeks out behind panel/photo corners. Purely
 * ornamental (`aria-hidden`). Position it via `className` (e.g.
 * `absolute -top-4 -end-5 -z-10`) inside a `relative` parent.
 */
function AccentSquare({
  color = "bg-brand-lavender",
  size = 96,
  rotate = 0,
  className,
  style,
  ...props
}: AccentSquareProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("rounded-[22px]", color, className)}
      style={{
        width: size,
        height: size,
        transform: `rotate(${rotate}deg)`,
        ...style,
      }}
      {...props}
    />
  )
}

export { AccentSquare }
