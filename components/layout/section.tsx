import { cn } from "@/lib/utils"

const spacings = {
  none: "",
  sm: "py-14 md:py-16",
  md: "py-16 md:py-24",
  lg: "py-20 md:py-28",
  xl: "py-24 md:py-32",
} as const

interface SectionProps extends React.ComponentProps<"section"> {
  /** Vertical rhythm preset. Defaults to the site-wide `lg` band. */
  spacing?: keyof typeof spacings
}

/**
 * Full-bleed page band. Owns the shared horizontal gutter (`px-5 md:px-9`) and
 * a vertical rhythm preset so every public section lines up; backgrounds and
 * extra layout come through `className`, and the inner column is a
 * {@link Container}.
 */
function Section({ spacing = "lg", className, ...props }: SectionProps) {
  return (
    <section
      className={cn("px-5 md:px-9", spacings[spacing], className)}
      {...props}
    />
  )
}

export { Section }
