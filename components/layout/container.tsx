import { cn } from "@/lib/utils"

const maxWidths = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
} as const

interface ContainerProps extends React.ComponentProps<"div"> {
  size?: keyof typeof maxWidths
}

function Container({ size = "lg", className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full", maxWidths[size], className)}
      {...props}
    />
  )
}

export { Container }
