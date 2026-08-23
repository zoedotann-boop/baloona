"use client"

import { useTranslations } from "next-intl"
import { useState, useTransition } from "react"

import { ConsentCheckbox } from "@/components/brand/consent-checkbox"
import { PillButton } from "@/components/brand/pill-button"
import { startPunchCardCheckout } from "@/lib/actions/shop"
import { cn } from "@/lib/utils"

const inputClass =
  "w-full h-12 rounded-xl bg-white border border-border px-4 text-[16px] text-foreground placeholder:text-muted-foreground focus:bg-white focus:border-primary focus:outline-none transition"

interface CheckoutFormProps {
  productId: string
  productName: string
  entriesLabel: string
  productPrice: string
  /** Branch the visitor came from, recorded as the card's issuing branch. */
  from: string
  /** Link to the terms page, opened from the consent label. */
  termsHref: string
}

/**
 * Checkout details + mandatory terms consent. Until PayMe is connected,
 * submitting issues the punch card immediately (see `purchasePunchCard`) so it
 * lands in the front-desk console, then offers the customer their card link.
 */
function CheckoutForm({
  productId,
  productName,
  entriesLabel,
  productPrice,
  from,
  termsHref,
}: CheckoutFormProps) {
  const t = useTranslations("checkout")
  const [agreed, setAgreed] = useState(false)
  const [status, setStatus] = useState<"idle" | "consent" | "error" | "done">(
    "idle"
  )
  const [token, setToken] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!agreed) {
      setStatus("consent")
      return
    }
    const form = new FormData(event.currentTarget)
    startTransition(async () => {
      const result = await startPunchCardCheckout({
        productId,
        from,
        fullName: String(form.get("fullName") ?? ""),
        phone: String(form.get("phone") ?? ""),
        email: String(form.get("email") ?? ""),
      })
      if (!result.ok) {
        setStatus("error")
      } else if ("redirect" in result) {
        // Payments on: hand off to PayMe's hosted page (full-page navigation).
        window.location.href = result.redirect
      } else {
        setToken(result.token)
        setStatus("done")
      }
    })
  }

  if (status === "done") {
    return (
      <div className="rounded-[26px] border border-border bg-brand-lavender-soft p-8 text-center">
        <p className="font-heading text-[22px] font-black text-brand-plum">
          {t("successTitle")}
        </p>
        <p className="mt-2 text-[16px] leading-relaxed text-brand-ink-soft">
          {t("successBody")}
        </p>
        {token && (
          <PillButton href={`/card/${token}`} size="md" className="mt-5">
            {t("viewCard")}
          </PillButton>
        )}
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
            if (next && status === "consent") setStatus("idle")
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
        {status === "error" && (
          <p role="alert" className="text-[15px] font-bold text-destructive">
            {t("error")}
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
