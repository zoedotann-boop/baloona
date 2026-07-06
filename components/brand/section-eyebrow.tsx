import { cn } from "@/lib/utils"

/** Small uppercase Rubik label that sits above section titles. */
function SectionEyebrow({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "font-heading text-[11px] font-extrabold tracking-[0.14em] text-brand-mauve uppercase",
        className
      )}
      {...props}
    />
  )
}

export { SectionEyebrow }
