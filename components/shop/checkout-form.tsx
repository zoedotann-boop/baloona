"use client"

import { useTranslations } from "next-intl"
import { useState, useTransition } from "react"

import { ConsentCheckbox } from "@/components/brand/consent-checkbox"
import { PillButton } from "@/components/brand/pill-button"
import { startPayment } from "@/lib/shop/payment"
import { cn } from "@/lib/utils"

const inputClass =
  "w-full h-12 rounded-xl bg-white border border-border px-4 text-[16px] text-foreground placeholder:text-muted-foreground focus:bg-white focus:border-primary focus:outline-none transition"

interface CheckoutFormProps {
  productId: string
  productName: string
  entriesLabel: string
  productPrice: string
  /** Link to the terms page, opened from the consent label. */
  termsHref: string
}

/**
 * Checkout details + mandatory terms consent. The "proceed to payment" button
 * runs a placeholder (`startPayment`) — PayMe is not connected yet, so nothing
 * is persisted; it only validates the form and requires the consent box.
 */
function CheckoutForm({
  productId,
  productName,
  entriesLabel,
  productPrice,
  termsHref,
}: CheckoutFormProps) {
  const t = useTranslations("checkout")
  const [agreed, setAgreed] = useState(false)
  const [status, setStatus] = useState<"idle" | "consent" | "done">("idle")
  const [pending, startTransition] = useTransition()

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!agreed) {
      setStatus("consent")
      return
    }
    const form = new FormData(event.currentTarget)
    startTransition(async () => {
      await startPayment({
        productId,
        fullName: String(form.get("fullName") ?? ""),
        phone: String(form.get("phone") ?? ""),
        email: String(form.get("email") ?? ""),
      })
      setStatus("done")
    })
  }

  if (status === "done") {
    return (
      <div className="rounded-[26px] border border-border bg-brand-lavender-soft p-8 text-center">
        <p className="text-[19px] leading-relaxed font-bold text-brand-plum">
          {t("placeholderNotice")}
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[26px] border border-border bg-white p-8"
    >
      <div className="stamp-edge mb-6 bg-accent p-[3px]">
        <div className="stamp-edge flex items-center justify-between gap-3 bg-white px-6 py-5">
          <div>
            <div className="font-heading text-[19px] font-black text-brand-plum">
              {productName}
            </div>
            <div className="mt-0.5 text-[14px] text-brand-ink-soft">
              {entriesLabel}
            </div>
          </div>
          <div className="font-heading text-[26px] font-black text-brand-plum">
            {productPrice}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <input
          name="fullName"
          required
          className={inputClass}
          placeholder={t("namePlaceholder")}
          autoComplete="name"
        />
        <input
          name="phone"
          type="tel"
          required
          dir="ltr"
          className={cn(inputClass, "text-right")}
          placeholder={t("phonePlaceholder")}
          autoComplete="tel"
        />
        <input
          name="email"
          type="email"
          required
          dir="ltr"
          className={cn(inputClass, "text-right")}
          placeholder={t("emailPlaceholder")}
          autoComplete="email"
        />

        <ConsentCheckbox
          checked={agreed}
          onChange={(next) => {
            setAgreed(next)
            if (next) setStatus("idle")
          }}
        >
          {t.rich("consent", {
            terms: (chunks) => (
              <a
                href={termsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-primary underline"
              >
                {chunks}
              </a>
            ),
          })}
        </ConsentCheckbox>

        {status === "consent" && (
          <p role="alert" className="text-[15px] font-bold text-destructive">
            {t("consentRequired")}
          </p>
        )}

        <PillButton
          type="submit"
          className="w-full"
          size="md"
          disabled={pending}
        >
          {t("proceed")}
        </PillButton>
      </div>
    </form>
  )
}

export { CheckoutForm }
