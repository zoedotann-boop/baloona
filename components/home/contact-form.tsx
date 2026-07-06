"use client"

import { useState } from "react"

import { PillButton } from "@/components/brand/pill-button"
import { CONTACT_SUBJECTS } from "@/lib/site-content"
import { cn } from "@/lib/utils"

const inputClass =
  "w-full h-12 rounded-xl bg-[#fff7f8] border border-[#f3d3d9] px-4 text-[14px] text-foreground placeholder:text-brand-muted focus:bg-white focus:border-primary focus:outline-none transition"

/** Contact form with subject chips (front-end only — no submission). */
function ContactForm() {
  const [subject, setSubject] = useState(CONTACT_SUBJECTS[0])

  return (
    <div className="rounded-[26px] border border-[#f3d3d9] bg-white p-8 shadow-[0_14px_36px_-22px_rgba(90,39,64,0.5)]">
      <div className="mb-5 font-heading text-[16px] font-black text-brand-brown">
        שלחו לנו הודעה
      </div>
      <div className="space-y-4">
        <input className={inputClass} placeholder="שם מלא" />
        <input
          dir="ltr"
          className={cn(inputClass, "text-right")}
          placeholder="050-0000000"
        />
        <div className="flex flex-wrap gap-2">
          {CONTACT_SUBJECTS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSubject(s)}
              className={cn(
                "h-9 rounded-full px-4 text-[12px] font-bold transition",
                subject === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-brand-brown hover:brightness-95"
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <textarea
          rows={5}
          className={cn(inputClass, "h-auto resize-none py-3")}
          placeholder="ספרו מה תרצו לדעת…"
        />
        <PillButton className="w-full" size="md">
          שלחו הודעה
        </PillButton>
      </div>
    </div>
  )
}

export { ContactForm }
