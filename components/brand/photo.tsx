import Image from "next/image"
import { Camera } from "lucide-react"

import { cn } from "@/lib/utils"

interface PhotoProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fit?: "cover" | "contain"
  objectPosition?: string
  label?: string
}

function Photo({
  src,
  alt = "",
  fit = "cover",
  objectPosition,
  label,
  className,
  ...props
}: PhotoProps) {
  if (src) {
    return (
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-[26px] bg-secondary",
          className
        )}
        {...props}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={objectPosition ? { objectPosition } : undefined}
          className={cn(
            fit === "contain" ? "object-contain p-6" : "object-cover"
          )}
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-[26px] bg-secondary text-muted-foreground",
        "bg-[radial-gradient(var(--brand-logo)_1px,transparent_1.4px)] bg-[length:12px_12px]",
        className
      )}
      {...props}
    >
      <Camera className="size-8 opacity-50" />
      {label && (
        <span className="px-3 text-center text-[13px] font-bold tracking-wide opacity-70">
          {label}
        </span>
      )}
    </div>
  )
}

export { Photo }
