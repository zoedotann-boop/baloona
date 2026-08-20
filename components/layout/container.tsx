import { cn } from "@/lib/utils"

const maxWidths = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
} as const

interface ContainerProps extends React.ComponentProps<"div"> {
  /** Content column width. Defaults to the site-wide `lg` (max-w-6xl). */
  size?: keyof typeof maxWidths
}

/**
 * Centered content column with the shared max width. The horizontal page
 * gutter lives on {@link Section}, so a `Container` only owns the width and
 * centering — pass grid/columns/flex layout through `className`.
 */
function Container({ size = "lg", className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full", maxWidths[size], className)}
      {...props}
    />
  )
}

export { Container }
