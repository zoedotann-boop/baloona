import { cn } from "@/lib/utils"

interface AccentSquareProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string
  size?: number
  rotate?: number
}

function AccentSquare({
  color = "bg-brand-pink",
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
