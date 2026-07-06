"use client"

import { useState } from "react"
import { Check } from "lucide-react"

import { PillButton } from "@/components/brand/pill-button"
import { BDAY_LEAD_FIELDS, BDAY_UPGRADES } from "@/lib/site-content"
import { cn } from "@/lib/utils"

/** Coral lead-capture form for booking a birthday (front-end only). */
function BirthdayLeadForm() {
  const [selected, setSelected] = useState<string[]>([])
  const toggle = (label: string) =>
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    )

  return (
    <section
      id="lead-form"
      className="scroll-mt-20 bg-primary px-5 py-16 text-brand-cream md:px-9"
    >
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-2 font-heading text-[36px] font-black">
          מוכנים לשריין תאריך?
        </h2>
        <p className="mb-8 text-[14px] text-brand-cream/80">
          נחזור אליכם תוך 24 שעות לאישור תאריך וסיכום ההזמנה.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {BDAY_LEAD_FIELDS.map((f) => (
            <div key={f.label}>
              <label className="mb-1.5 block text-[11px] font-bold text-brand-cream/80">
                {f.label}
              </label>
              <input
                placeholder={f.placeholder}
                className="h-12 w-full rounded-2xl border border-white/25 bg-white/15 px-4 text-[13px] text-white transition placeholder:text-white/60 focus:bg-white/25 focus:outline-none"
              />
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-[20px] border border-white/20 bg-white/10 p-5">
          <div className="mb-3 font-heading text-[13px] font-black">
            תוספות ושדרוגים
          </div>
          <div className="space-y-2">
            {BDAY_UPGRADES.map((u) => {
              const checked = selected.includes(u.label)
              return (
                <button
                  key={u.label}
                  type="button"
                  onClick={() => toggle(u.label)}
                  className="flex w-full items-center gap-3 rounded-xl p-2.5 text-right transition hover:bg-white/5"
                >
                  <span
                    className={cn(
                      "flex size-5 flex-none items-center justify-center rounded-md transition",
                      checked
                        ? "bg-brand-cream text-primary"
                        : "border border-white/30 bg-white/10"
                    )}
                  >
                    {checked && <Check className="size-3.5" strokeWidth={3} />}
                  </span>
                  <span className="flex-1 text-[13px] text-brand-cream/90">
                    {u.label}
                  </span>
                  <span className="font-heading text-[13px] font-black">
                    {u.price}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <PillButton variant="soft" size="md" className="mt-6 w-full">
          שליחת בקשה
        </PillButton>
      </div>
    </section>
  )
}

export { BirthdayLeadForm }
