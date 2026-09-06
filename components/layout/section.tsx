import { cn } from "@/lib/utils"

const spacings = {
  none: "",
  sm: "py-14 md:py-16",
  md: "py-16 md:py-24",
  lg: "py-20 md:py-28",
  xl: "py-24 md:py-32",
} as const

interface SectionProps extends React.ComponentProps<"section"> {
  spacing?: keyof typeof spacings
}

function Section({ spacing = "lg", className, ...props }: SectionProps) {
  return (
    <section
      className={cn("px-5 md:px-9", spacings[spacing], className)}
      {...props}
    />
  )
}

export { Section }
