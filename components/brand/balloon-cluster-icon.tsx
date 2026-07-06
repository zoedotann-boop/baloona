import { cn } from "@/lib/utils"

interface BalloonClusterIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Petal color. Defaults to the brand coral. */
  color?: string
  /** Overall box size in pixels. */
  size?: number
}

// Six petals arranged radially around a white center — the recurring
// balloon/flower motif from the Baloona design.
const PETAL_ANGLES = [0, 60, 120, 180, 240, 300]

function BalloonClusterIcon({
  color = "var(--brand-coral)",
  size = 50,
  className,
  style,
  ...props
}: BalloonClusterIconProps) {
  const petal = size * 0.36
  const center = size * 0.36

  return (
    <span
      className={cn("relative inline-block shrink-0", className)}
      style={{ width: size, height: size, ...style }}
      aria-hidden="true"
      {...props}
    >
      {PETAL_ANGLES.map((angle) => (
        <span
          key={angle}
          className="absolute top-1/2 left-1/2 rounded-[50%]"
          style={{
            width: petal,
            height: petal * 1.33,
            marginTop: -(petal * 1.33) / 2,
            marginLeft: -petal / 2,
            background: color,
            transform: `rotate(${angle}deg) translateY(${-(petal * 1.33) / 2}px)`,
          }}
        />
      ))}
      <span
        className="absolute top-1/2 left-1/2 rounded-[50%] bg-white"
        style={{
          width: center,
          height: center,
          marginTop: -center / 2,
          marginLeft: -center / 2,
        }}
      />
    </span>
  )
}

export { BalloonClusterIcon }
