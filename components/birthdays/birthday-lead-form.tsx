"use client"

import { useState } from "react"
import { Check, PartyPopper } from "lucide-react"

import { PillButton } from "@/components/brand/pill-button"
import { SignaturePad } from "@/components/brand/signature-pad"
import {
  BDAY_LEAD_CANCELLATION,
  BDAY_LEAD_CONSENT,
  BDAY_LEAD_DISCLAIMER,
  BDAY_LEAD_FIELDS,
  BDAY_LEAD_PACKAGE,
  BDAY_LEAD_SIGN_CLEAR,
  BDAY_LEAD_SIGN_HINT,
  BDAY_LEAD_SIGN_TITLE,
  BDAY_LEAD_SUBMIT,
  BDAY_LEAD_SUCCESS,
  BDAY_UPGRADES,
} from "@/lib/site-content"
import { cn } from "@/lib/utils"

const inputClass =
  "h-12 w-full rounded-xl border border-border bg-white px-4 text-[16px] text-foreground placeholder:text-muted-foreground transition focus:border-primary focus:outline-none"

/** Birthday lead-capture form: details, consent and a digital signature. */
function BirthdayLeadForm() {
  const [selected, setSelected] = useState<string[]>([])
  const [agreed, setAgreed] = useState(false)
  const [signed, setSigned] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const toggle = (label: string) =>
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    )

  const canSubmit = agreed && signed

  return (
    <section
      id="lead-form"
      className="scroll-mt-20 px-5 py-20 text-foreground md:px-9 md:py-28"
    >
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h2 className="font-heading text-[clamp(32px,4.5vw,44px)] font-black text-brand-plum">
            טופס אישור והתחייבות לאירוע
          </h2>
          <p className="mt-3 text-[17px] leading-relaxed text-brand-ink-soft">
            מלאו את הפרטים, בחרו את השדרוגים הרצויים וחתמו בתחתית הטופס.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-[28px] border border-border bg-white p-10 text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <PartyPopper className="size-7" />
            </div>
            <p className="text-[19px] leading-relaxed font-bold text-brand-plum">
              {BDAY_LEAD_SUCCESS}
            </p>
          </div>
        ) : (
          <div className="rounded-[28px] border border-border bg-white p-6 md:p-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {BDAY_LEAD_FIELDS.map((f) => (
                <div key={f.label}>
                  <label className="mb-1.5 block text-[14px] font-bold text-brand-plum">
                    {f.label}
                  </label>
                  <input className={inputClass} placeholder={f.placeholder} />
                </div>
              ))}
            </div>

            {/* Upgrades */}
            <div className="mt-6">
              <div className="mb-1 font-heading text-[16px] font-black text-brand-plum">
                תוספות ושדרוגים
              </div>
              <div className="divide-y divide-border">
                {BDAY_UPGRADES.map((u) => {
                  const checked = selected.includes(u.label)
                  return (
                    <button
                      key={u.label}
                      type="button"
                      onClick={() => toggle(u.label)}
                      className="flex w-full items-center gap-3 py-3 text-right transition hover:opacity-80"
                    >
                      <span
                        className={cn(
                          "flex size-5 flex-none items-center justify-center rounded-md border transition",
                          checked
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-white"
                        )}
                      >
                        {checked && (
                          <Check className="size-3.5" strokeWidth={3} />
                        )}
                      </span>
                      <span className="flex-1 text-[16px] text-foreground">
                        {u.label}
                      </span>
                      <span className="font-heading text-[16px] font-black text-brand-plum">
                        {u.price}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Package summary */}
            <div className="mt-6 flex items-center justify-between gap-4 rounded-[20px] bg-brand-pink-soft p-4">
              <div>
                <div className="font-heading text-[17px] font-black text-brand-plum">
                  {BDAY_LEAD_PACKAGE.label}
                </div>
                <div className="mt-1 text-[14px] text-brand-ink-soft">
                  {BDAY_LEAD_PACKAGE.deposit}
                </div>
              </div>
              <div className="font-heading text-[20px] font-black text-brand-plum">
                {BDAY_LEAD_PACKAGE.price} ₪
              </div>
            </div>

            {/* Cancellation policy (info) */}
            <p className="mt-6 text-[14px] leading-relaxed text-muted-foreground">
              {BDAY_LEAD_CANCELLATION}
            </p>

            {/* Required consent */}
            <button
              type="button"
              onClick={() => setAgreed((prev) => !prev)}
              className="mt-4 flex w-full items-start gap-3 text-right"
              aria-pressed={agreed}
            >
              <span
                className={cn(
                  "mt-0.5 flex size-5 flex-none items-center justify-center rounded-md border transition",
                  agreed
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-muted"
                )}
              >
                {agreed && <Check className="size-3.5" strokeWidth={3} />}
              </span>
              <span className="flex-1 text-[15px] leading-relaxed text-foreground">
                {BDAY_LEAD_CONSENT}
              </span>
            </button>

            {/* Digital signature */}
            <div className="mt-6">
              <div className="mb-2 font-heading text-[16px] font-black text-brand-plum">
                {BDAY_LEAD_SIGN_TITLE}
              </div>
              <SignaturePad
                hint={BDAY_LEAD_SIGN_HINT}
                clearLabel={BDAY_LEAD_SIGN_CLEAR}
                onChange={setSigned}
              />
            </div>

            <PillButton
              className="mt-6 w-full"
              size="md"
              disabled={!canSubmit}
              onClick={() => setSubmitted(true)}
            >
              {BDAY_LEAD_SUBMIT}
            </PillButton>

            <p className="mt-3 text-center text-[13px] text-muted-foreground">
              {BDAY_LEAD_DISCLAIMER}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export { BirthdayLeadForm }
