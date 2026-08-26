"use client"

import Form from "@rjsf/shadcn"
import validator from "@rjsf/validator-ajv8"
import { useTranslations } from "next-intl"
import { Check, PartyPopper } from "lucide-react"
import { useMemo, useState, useTransition } from "react"

import { PillButton } from "@/components/brand/pill-button"
import { SignaturePad } from "@/components/brand/signature-pad"
import { WallScene } from "@/components/brand/wall-scene"
import { submitBirthdayLead } from "@/lib/actions/leads"
import {
  buildBirthdayForm,
  type BirthdayFormFieldView,
} from "@/lib/birthday-form"
import { cn } from "@/lib/utils"

interface BirthdayUpgradeOption {
  id: string
  label: string
  price: string
}

interface BirthdayLeadFormProps {
  locationId: string
  title: string
  description: string
  fields: BirthdayFormFieldView[]
  upgradesTitle: string
  upgrades: BirthdayUpgradeOption[]
  packageSummary: string
  packagePrice: string
  depositNote: string
  cancellationPolicy: string
  consentLabel: string
  disclaimer: string
  successMessage: string
  requiresSignature: boolean
  signatureTitle: string
  signatureHint: string
}

type Answers = Record<string, unknown>

/**
 * Birthday booking form.
 *
 * The questions come from the location's `birthdayFormFields` rows, compiled
 * into a JSON Schema and rendered by `@rjsf/shadcn`, so an editor can add or
 * remove a question without a code change. The parts that carry legal weight —
 * upgrades, cancellation consent and the signature — stay hand-written around
 * the generated fields.
 */
function BirthdayLeadForm({
  locationId,
  title,
  description,
  fields,
  upgradesTitle,
  upgrades,
  packageSummary,
  packagePrice,
  depositNote,
  cancellationPolicy,
  consentLabel,
  disclaimer,
  successMessage,
  requiresSignature,
  signatureTitle,
  signatureHint,
}: BirthdayLeadFormProps) {
  const t = useTranslations("birthdays")
  const [answers, setAnswers] = useState<Answers>({})
  const [selected, setSelected] = useState<string[]>([])
  const [agreed, setAgreed] = useState(false)
  const [signature, setSignature] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [pending, startTransition] = useTransition()

  const { schema, uiSchema } = useMemo(
    () => buildBirthdayForm(fields),
    [fields]
  )

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]
    )

  function handleSubmit(formData: Answers | undefined) {
    setError(null)
    if (!agreed) return setError(t("consentRequired"))
    if (requiresSignature && !signature) return setError(t("signatureRequired"))

    startTransition(async () => {
      const result = await submitBirthdayLead({
        locationId,
        answers: (formData ?? {}) as Record<string, string>,
        upgradeIds: selected,
        consent: agreed,
        signature: signature ?? undefined,
      })
      if (result.ok) setSubmitted(true)
      else setError(t("error"))
    })
  }

  return (
    <section
      id="lead-form"
      className="relative isolate scroll-mt-20 overflow-hidden px-5 py-20 text-foreground md:px-9 md:py-28"
    >
      <WallScene variant="party" />
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h2 className="font-heading text-[clamp(32px,4.5vw,44px)] font-black text-brand-plum">
            {title}
          </h2>
          <p className="mt-3 text-[17px] leading-relaxed text-brand-ink-soft">
            {description}
          </p>
        </div>

        {submitted ? (
          <div className="rounded-[28px] border border-border bg-white p-10 text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <PartyPopper className="size-7" />
            </div>
            <p className="text-[19px] leading-relaxed font-bold text-brand-plum">
              {successMessage}
            </p>
          </div>
        ) : (
          <div className="rounded-[28px] border border-border bg-white p-6 md:p-8">
            <Form
              schema={schema}
              uiSchema={uiSchema}
              validator={validator}
              formData={answers}
              onChange={(event) => setAnswers(event.formData ?? {})}
              onSubmit={(event) => handleSubmit(event.formData)}
              showErrorList={false}
              noHtml5Validate
            >
              {upgrades.length > 0 && (
                <div className="mt-6">
                  <div className="mb-1 font-heading text-[16px] font-black text-brand-plum">
                    {upgradesTitle}
                  </div>
                  <div className="divide-y divide-border">
                    {upgrades.map((upgrade) => {
                      const checked = selected.includes(upgrade.id)
                      return (
                        <button
                          key={upgrade.id}
                          type="button"
                          onClick={() => toggle(upgrade.id)}
                          aria-pressed={checked}
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
                            {upgrade.label}
                          </span>
                          <span className="font-heading text-[16px] font-black text-brand-plum">
                            {upgrade.price}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Package summary */}
              <div className="mt-6 flex items-center justify-between gap-4 rounded-[20px] bg-brand-pink-soft p-4">
                <div>
                  <div className="font-heading text-[17px] font-black text-brand-plum">
                    {packageSummary}
                  </div>
                  <div className="mt-1 text-[14px] text-brand-ink-soft">
                    {depositNote}
                  </div>
                </div>
                <div className="font-heading text-[20px] font-black text-brand-plum">
                  {packagePrice}
                </div>
              </div>

              <p className="mt-6 text-[14px] leading-relaxed text-muted-foreground">
                {cancellationPolicy}
              </p>

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
                  {consentLabel}
                </span>
              </button>

              {requiresSignature && (
                <div className="mt-6">
                  <div className="mb-2 font-heading text-[16px] font-black text-brand-plum">
                    {signatureTitle}
                  </div>
                  <SignaturePad
                    hint={signatureHint}
                    clearLabel={t("clearSignature")}
                    onChange={setSignature}
                  />
                </div>
              )}

              {error && (
                <p
                  role="alert"
                  className="mt-4 text-[15px] font-bold text-destructive"
                >
                  {error}
                </p>
              )}

              <PillButton
                type="submit"
                className="mt-6 w-full"
                size="md"
                disabled={pending}
              >
                {pending ? t("sending") : t("submit")}
              </PillButton>

              <p className="mt-3 text-center text-[13px] text-muted-foreground">
                {disclaimer}
              </p>
            </Form>
          </div>
        )}
      </div>
    </section>
  )
}

export { BirthdayLeadForm }
