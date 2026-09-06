import Image from "next/image"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const logoVariants = cva("inline-block w-auto select-none", {
  variants: {
    size: {
      sm: "h-8",
      md: "h-11",
      lg: "h-16",
      hero: "h-[clamp(72px,13vw,168px)]",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

interface LogoProps extends VariantProps<typeof logoVariants> {
  className?: string
  label?: string
}

function Logo({ className, size, label = "Baloona" }: LogoProps) {
  return (
    <Image
      src="/assets/brand/logo.png"
      alt={label}
      width={1109}
      height={388}
      priority
      className={cn(logoVariants({ size }), className)}
    />
  )
}

export { Logo }
