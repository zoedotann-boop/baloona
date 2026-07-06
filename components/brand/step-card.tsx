import Image from "next/image"

import { cn } from "@/lib/utils"

interface StepCardProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number
  image: string
  title: string
  sub?: string
}

/** Numbered step card with an illustration — used in "how it works" grids. */
function StepCard({ index, image, title, sub, className, ...props }: StepCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center rounded-[28px] bg-white px-6 py-8 text-center",
        className
      )}
      {...props}
    >
      <div className="absolute -top-3 -right-3 flex size-8 items-center justify-center rounded-full bg-[#ff7d59] font-heading text-[13px] font-black text-white shadow-[0_10px_18px_-8px_rgba(255,125,89,0.95)]">
        {index}
      </div>
      <div className="mb-5 flex size-20 items-center justify-center rounded-full bg-[#fcecde]">
        <Image
          src={image}
          alt={title}
          width={48}
          height={48}
          className="size-12 object-contain"
        />
      </div>
      <div className="font-heading text-[16px] font-black text-brand-brown">
        {title}
      </div>
      {sub && (
        <div className="mt-1.5 text-[13px] leading-relaxed text-brand-muted">
          {sub}
        </div>
      )}
    </div>
  )
}

export { StepCard }
