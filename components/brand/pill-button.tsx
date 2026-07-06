import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const pillButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-extrabold whitespace-nowrap transition-transform outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Coral solid — the primary call to action.
        primary:
          "bg-primary text-primary-foreground shadow-[0_14px_30px_-12px_rgba(238,138,160,0.8)] hover:brightness-105",
        // White with a dark outline.
        outline:
          "border-2 border-foreground bg-white text-foreground hover:bg-muted",
        // Cream on a colored surface (e.g. the birthday card).
        soft: "bg-brand-cream text-brand-brown hover:brightness-95",
      },
      size: {
        md: "h-[46px] px-6 text-sm",
        lg: "h-[54px] px-7 text-[15px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "lg",
    },
  }
)

type PillButtonProps = VariantProps<typeof pillButtonVariants> &
  (
    | ({ href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
    | ({ href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>)
  )

/** Fully-rounded brand button. Renders an `<a>` when `href` is provided. */
function PillButton({ className, variant, size, ...props }: PillButtonProps) {
  const classes = cn(pillButtonVariants({ variant, size }), className)

  if (props.href !== undefined) {
    return <a className={classes} {...props} />
  }

  const { href: _href, ...buttonProps } =
    props as React.ButtonHTMLAttributes<HTMLButtonElement> & {
      href?: undefined
    }
  return <button className={classes} {...buttonProps} />
}

export { PillButton, pillButtonVariants }
