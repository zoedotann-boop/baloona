import { PillButton } from "@/components/brand/pill-button"

interface CheckoutResultCardProps {
  title: string
  body: string
  /** Optional call to action — e.g. "view your card" or "back to the shop". */
  cta?: { label: string; href: string }
}

/**
 * The soft confirmation panel that closes the checkout — the "your card is
 * ready" / "still processing" message with an optional call to action. Shared by
 * the inline checkout success state ({@link CheckoutForm}) and the PayMe return
 * page so both read exactly alike, on the brand's lavender-soft surface.
 */
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
