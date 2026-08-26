import { cn } from "@/lib/utils"

interface StatusFloatProps {
  /** Full opening-status line from the venue's real hours. */
  label: string
  /** Green pill when open, red when closed. */
  isOpen: boolean
}

/**
 * Desktop floating open/closed chip that scrolls with the page, pinned to the
 * bottom-start corner. The mobile hero carries its own compact chip
 * ({@link import("./hero-mobile-actions").HeroMobileActions}); this covers every
 * larger viewport, where the header no longer shows the status inline.
 */
function StatusFloat({ label, isOpen }: StatusFloatProps) {
  return (
    <div className="pointer-events-none fixed bottom-6 left-4 z-40 hidden md:block">
      <span
        className={cn(
          "flex items-center gap-2 rounded-full px-4 py-2.5 font-heading text-sm font-bold text-white shadow-lg ring-4 ring-white/60",
          isOpen ? "bg-brand-green" : "bg-red-500"
        )}
      >
        <span className="animate-baloona-pulse size-[7px] rounded-full bg-white" />
        {label}
      </span>
    </div>
  )
}

export { StatusFloat }
