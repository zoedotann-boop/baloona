"use client"

import { useTranslations } from "next-intl"
import { useState, useTransition } from "react"

import { PillButton } from "@/components/brand/pill-button"
import { HoneypotField } from "@/components/forms/honeypot-field"
import { submitContactLead } from "@/lib/actions/leads"
import { collectFieldErrors, type FieldErrors } from "@/lib/forms/field-errors"
import { HONEYPOT_FIELD } from "@/lib/forms/honeypot"
import { contactLeadSchema } from "@/lib/forms/schemas"
import { cn } from "@/lib/utils"

const inputClass =
  "w-full h-12 rounded-xl bg-white border border-border px-4 text-[16px] text-foreground placeholder:text-muted-foreground focus:bg-white focus:border-primary focus:outline-none transition"

interface ContactFormProps {
  locationId: string
  subjects: string[]
}

/** Contact form: subject chips plus a message, stored as a lead on submit. */
function ContactForm({ locationId, subjects }: ContactFormProps) {
  const t = useTranslations("contact")
  const tErrors = useTranslations("forms")
  const [subject, setSubject] = useState(subjects[0] ?? "")
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle")
  const [errors, setErrors] = useState<FieldErrors>({})
  const [pending, startTransition] = useTransition()

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const payload = {
      locationId,
      fullName: String(form.get("fullName") ?? ""),
      phone: String(form.get("phone") ?? ""),
      subject,
      message: String(form.get("message") ?? ""),
      honeypot: String(form.get(HONEYPOT_FIELD) ?? ""),
    }

    const parsed = contactLeadSchema.safeParse(payload)
    if (!parsed.success) {
      setErrors(collectFieldErrors(parsed.error.issues, payload, tErrors))
      return
    }

    setErrors({})
    startTransition(async () => {
      const result = await submitContactLead(parsed.data)
      setStatus(result.ok ? "sent" : "error")
    })
  }

  if (status === "sent") {
    return (
      <div className="rounded-[26px] border border-border bg-white p-8 text-center">
        <p className="text-[19px] leading-relaxed font-bold text-brand-plum">
          {t("success")}
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-[26px] border border-border bg-white p-8"
    >
      <div className="mb-5 font-heading text-[18px] font-black text-brand-plum">
        {t("formTitle")}
      </div>
      <div className="space-y-4">
        <div>
          <input
            name="fullName"
            required
            aria-invalid={Boolean(errors.fullName)}
            className={cn(inputClass, errors.fullName && "border-destructive")}
            placeholder={t("namePlaceholder")}
          />
          <FieldError message={errors.fullName} />
        </div>
        <div>
          <input
            name="phone"
            type="tel"
            required
            dir="ltr"
            aria-invalid={Boolean(errors.phone)}
            className={cn(
              inputClass,
              "text-right",
              errors.phone && "border-destructive"
            )}
            placeholder={t("phonePlaceholder")}
          />
          <FieldError message={errors.phone} />
        </div>
        {subjects.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {subjects.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSubject(option)}
                aria-pressed={subject === option}
                className={cn(
                  "h-9 rounded-full px-4 text-[14px] font-bold transition",
                  subject === option
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:brightness-95"
                )}
              >
                {option}
              </button>
            ))}
          </div>
        )}
        <div>
          <textarea
            name="message"
            required
            rows={5}
            aria-invalid={Boolean(errors.message)}
            className={cn(
              inputClass,
              "h-auto resize-none py-3",
              errors.message && "border-destructive"
            )}
            placeholder={t("messagePlaceholder")}
          />
          <FieldError message={errors.message} />
        </div>
        <HoneypotField />
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
          {pending ? t("sending") : t("submit")}
        </PillButton>
      </div>
    </form>
  )
}

/** Inline, RTL-friendly validation message shown under a field. */
function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p role="alert" className="mt-1.5 text-[13px] font-bold text-destructive">
      {message}
    </p>
  )
}

export { ContactForm }
