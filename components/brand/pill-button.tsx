import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const pillButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-extrabold whitespace-nowrap transition-transform duration-200 outline-none select-none hover:-translate-y-0.5 focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Baby-pink solid — the primary call to action. Definition comes from
        // the hover-lift (see base) and dark text, not a drop-shadow glow.
        primary: "bg-brand-pink text-brand-plum",
        // White with a dark outline.
        outline:
          "border-2 border-foreground bg-white text-foreground hover:bg-muted",
        // Soft cloud surface — used on a colored background (e.g. birthday card).
        soft: "bg-brand-cloud text-foreground",
      },
      size: {
        // Matches the admin's control height (h-9), so it lines up with the
        // language switch and the outline buttons beside it. The site's own
        // CTAs stay on `md`/`lg`.
        sm: "h-9 px-4 text-[14px]",
        md: "h-[46px] px-6 text-base",
        lg: "h-[54px] px-7 text-[17px]",
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

  return (
    <button
      className={classes}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    />
  )
}

export { PillButton }
