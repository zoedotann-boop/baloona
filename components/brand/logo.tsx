import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const logoVariants = cva(
  "inline-block font-heading font-extrabold tracking-[-0.02em] text-brand-logo select-none",
  {
    variants: {
      size: {
        sm: "text-2xl",
        md: "text-[28px] leading-none",
        lg: "text-5xl",
        hero: "text-[clamp(64px,12vw,160px)] leading-[0.9]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

interface LogoProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof logoVariants> {
  label?: string
}

/** Baloona wordmark. Rubik extra-bold in the brand pink. */
function Logo({ className, size, label = "Baloona", ...props }: LogoProps) {
  return (
    <span className={cn(logoVariants({ size }), className)} {...props}>
      {label}
    </span>
  )
}

export { Logo }
