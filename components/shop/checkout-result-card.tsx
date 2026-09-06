import { PillButton } from "@/components/brand/pill-button"

interface CheckoutResultCardProps {
  title: string
  body: string
  cta?: { label: string; href: string }
}

export function CheckoutResultCard({
  title,
  body,
  cta,
}: CheckoutResultCardProps) {
  return (
    <div className="rounded-[28px] border border-border bg-brand-lavender-soft p-8 text-center">
      <p className="font-heading text-[22px] font-black text-brand-plum">
        {title}
      </p>
      <p className="mt-2 text-[16px] leading-relaxed text-brand-ink-soft">
        {body}
      </p>
      {cta && (
        <PillButton href={cta.href} size="md" className="mt-5">
          {cta.label}
        </PillButton>
      )}
    </div>
  )
}
