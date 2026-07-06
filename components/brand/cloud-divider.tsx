import { cn } from "@/lib/utils"

interface CloudDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Scallop scale. */
  size?: "sm" | "md"
  /** Color of the scalloped bumps (the "clouds"). */
  cloudColor?: string
  /** Background behind the clouds. */
  bgColor?: string
}

// Repeating scalloped edge that separates the pink hero from white sections.
const SIZES = {
  sm: { height: 30, radius: 17, tile: 36 },
  md: { height: 42, radius: 26, tile: 56 },
}

function CloudDivider({
  size = "md",
  cloudColor = "#fff",
  bgColor = "var(--brand-pink)",
  className,
  style,
  ...props
}: CloudDividerProps) {
  const { height, radius, tile } = SIZES[size]

  return (
    <div
      className={cn("w-full", className)}
      aria-hidden="true"
      style={{
        height,
        background: `radial-gradient(circle at ${tile / 2}px ${height}px, ${cloudColor} ${radius}px, transparent ${radius + 1}px) 0 0/${tile}px ${height}px repeat-x, ${bgColor}`,
        ...style,
      }}
      {...props}
    />
  )
}

export { CloudDivider }
