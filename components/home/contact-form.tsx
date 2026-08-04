"use client"

import { useTranslations } from "next-intl"
import { useState, useTransition } from "react"

import { PillButton } from "@/components/brand/pill-button"
import { submitContactLead } from "@/lib/actions/leads"
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
  const [subject, setSubject] = useState(subjects[0] ?? "")
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle")
  const [pending, startTransition] = useTransition()

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    startTransition(async () => {
      const result = await submitContactLead({
        locationId,
        fullName: String(form.get("fullName") ?? ""),
        phone: String(form.get("phone") ?? ""),
        subject,
        message: String(form.get("message") ?? ""),
      })
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
      className="rounded-[26px] border border-border bg-white p-8"
    >
      <div className="mb-5 font-heading text-[18px] font-black text-brand-plum">
        {t("formTitle")}
      </div>
      <div className="space-y-4">
        <input
          name="fullName"
          required
          className={inputClass}
          placeholder={t("namePlaceholder")}
        />
        <input
          name="phone"
          type="tel"
          required
          dir="ltr"
          className={cn(inputClass, "text-right")}
          placeholder={t("phonePlaceholder")}
        />
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
        <textarea
          name="message"
          required
          rows={5}
          className={cn(inputClass, "h-auto resize-none py-3")}
          placeholder={t("messagePlaceholder")}
        />
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

export { ContactForm }
