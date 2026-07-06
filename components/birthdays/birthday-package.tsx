import { AlertTriangle } from "lucide-react"

import { Icon } from "@/components/brand/icon"
import { IconTile } from "@/components/brand/icon-tile"
import {
  BDAY_PACKAGE_LINES,
  BDAY_RULES,
  BDAY_UPGRADES,
} from "@/lib/site-content"
import { cn } from "@/lib/utils"

/** Birthday package: price, what's included, upgrades and important rules. */
function BirthdayPackage() {
  return (
    <section className="px-5 py-16 md:px-9">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
        {/* Package + included */}
        <div>
          <h2 className="mb-6 font-heading text-[32px] font-black text-brand-brown">
            חבילת יום הולדת
          </h2>
          <div className="mb-5 rounded-[26px] bg-primary p-8 text-brand-cream shadow-[0_20px_48px_-18px_rgba(255,125,89,0.75)]">
            <div className="font-heading text-[11px] font-extrabold tracking-[0.14em] text-brand-cream/70 uppercase">
              חבילת יום הולדת
            </div>
            <div className="mt-2 font-heading text-[56px] leading-none font-black">
              1,990
              <span className="text-[20px] font-bold opacity-70"> ₪</span>
            </div>
            <div className="mt-2 text-[14px] text-brand-cream/85">
              ל-25 ילדים · 49 ₪ לכל ילד נוסף
            </div>
          </div>

          <div className="overflow-hidden rounded-[26px] border border-[#f3d3d9] bg-white shadow-[0_14px_36px_-24px_rgba(90,39,64,0.5)]">
            <div className="border-b border-[#f1dde1] bg-brand-cream px-5 py-3 font-heading text-[11px] font-extrabold tracking-[0.14em] text-brand-mauve uppercase">
              מה כלול בחבילה
            </div>
            {BDAY_PACKAGE_LINES.map((line, i) => (
              <div
                key={line}
                className={cn(
                  "flex items-center gap-3 px-5 py-3.5",
                  i < BDAY_PACKAGE_LINES.length - 1 &&
                    "border-b border-[#f1dde1]"
                )}
              >
                <Icon name="check" className="size-4 shrink-0 text-primary" />
                <span className="text-[13px] text-[#6b5f60]">{line}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-1 rounded-[20px] bg-secondary p-4 text-[12px] text-brand-brown">
            <div>
              · <strong>מקדמה לשיריון:</strong> 400 ₪
            </div>
            <div>
              · <strong>אח/בן משפחה נוסף</strong> חייב בכרטיס כניסה
            </div>
          </div>
        </div>

        {/* Upgrades + rules */}
        <div>
          <h2 className="mb-6 font-heading text-[32px] font-black text-brand-brown">
            תוספות ושדרוגים
          </h2>
          <div className="mb-8 space-y-3">
            {BDAY_UPGRADES.map((u) => (
              <div
                key={u.label}
                className="flex items-center gap-4 rounded-[20px] border border-[#f3d3d9] bg-white p-4 shadow-[0_12px_32px_-24px_rgba(90,39,64,0.5)]"
              >
                <IconTile icon={u.icon} tone="pink" size="sm" />
                <div className="flex-1 text-[14px] font-bold text-brand-brown">
                  {u.label}
                </div>
                <div className="font-heading text-[16px] font-black text-primary">
                  {u.price}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[26px] border-2 border-primary bg-white p-5 shadow-[0_14px_36px_-24px_rgba(90,39,64,0.5)]">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <AlertTriangle className="size-4" />
              </div>
              <div className="font-heading text-[14px] font-black text-brand-brown">
                חוקים חשובים
              </div>
            </div>
            <ul className="space-y-2.5 text-[13px] text-[#6b5f60]">
              {BDAY_RULES.map((rule) => (
                <li key={rule} className="flex items-start gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export { BirthdayPackage }
