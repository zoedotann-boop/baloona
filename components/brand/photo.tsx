import { Camera } from "lucide-react"

import { cn } from "@/lib/utils"

interface PhotoProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional caption shown under the camera glyph. */
  label?: string
}

/**
 * Placeholder for a real photo — a soft pink panel with a dotted texture and a
 * camera glyph. Swap for <Image> once real assets are available.
 */
function Photo({ label, className, ...props }: PhotoProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-[26px] bg-secondary text-brand-mauve",
        "bg-[radial-gradient(var(--brand-mauve)_1px,transparent_1.4px)] bg-[length:12px_12px]",
        className
      )}
      {...props}
    >
      <Camera className="size-8 opacity-50" />
      {label && (
        <span className="px-3 text-center text-[11px] font-bold tracking-wide opacity-70">
          {label}
        </span>
      )}
    </div>
  )
}

export { Photo }
