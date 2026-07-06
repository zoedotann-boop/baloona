import { cn } from "@/lib/utils"

interface MenuItemCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  price: string
  desc?: string
}

/** A single menu line — name, price and optional description. */
function MenuItemCard({
  name,
  price,
  desc,
  className,
  ...props
}: MenuItemCardProps) {
  return (
    <div
      className={cn(
        "rounded-[20px] border border-[#f3d3d9] bg-white p-5 shadow-[0_12px_32px_-24px_rgba(90,39,64,0.5)]",
        className
      )}
      {...props}
    >
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <div className="text-[15px] font-bold text-brand-brown">{name}</div>
        <div className="font-heading text-[16px] font-extrabold whitespace-nowrap text-primary">
          {price}
        </div>
      </div>
      {desc && (
        <div className="text-[12px] leading-snug text-brand-muted">{desc}</div>
      )}
    </div>
  )
}

export { MenuItemCard }
