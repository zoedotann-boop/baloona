import { Icon } from "@/components/brand/icon"
import { IconTile } from "@/components/brand/icon-tile"
import { SectionEyebrow } from "@/components/brand/section-eyebrow"
import { ContactForm } from "@/components/home/contact-form"
import { BALOONA, CONTACT_METHODS } from "@/lib/site-content"

const METHOD_TONES = ["coral", "sky", "pink", "cream"] as const

/** Contact block: quick methods + opening hours + a message form. */
function ContactSection() {
  return (
    <section id="contact" className="px-5 py-16 md:px-9">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <SectionEyebrow>
            משאירים לנו הודעה — נחזור אליכם תוך שעה בימי הפעילות
          </SectionEyebrow>
          <h2 className="mt-1 font-heading text-[40px] font-black text-brand-brown">
            צרו קשר
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="mb-6 grid grid-cols-2 gap-4">
              {CONTACT_METHODS.map((c, i) => (
                <button
                  key={c.label}
                  type="button"
                  className="rounded-[22px] border border-[#f3d3d9] bg-white p-5 text-right shadow-[0_14px_36px_-24px_rgba(90,39,64,0.5)] transition active:scale-[.98]"
                >
                  <IconTile
                    icon={c.icon}
                    tone={METHOD_TONES[i]}
                    className="mb-3"
                  />
                  <div className="text-[14px] font-bold text-brand-brown">
                    {c.label}
                  </div>
                  <div className="mt-0.5 text-[12px] text-brand-muted">
                    {c.sub}
                  </div>
                </button>
              ))}
            </div>

            <div className="rounded-[26px] border border-[#f3d3d9] bg-white p-6 shadow-[0_14px_36px_-24px_rgba(90,39,64,0.5)]">
              <div className="mb-4 flex items-center gap-2 font-heading text-[13px] font-black text-brand-brown">
                <Icon name="clock" className="size-4" />
                שעות פתיחה
              </div>
              <div className="text-[13px]">
                {BALOONA.hours.map((h) => (
                  <div
                    key={h.days}
                    className="flex items-center justify-between border-b border-[#f1dde1] py-2 last:border-0"
                  >
                    <span className="font-bold text-[#6b5f60]">{h.days}</span>
                    <span className="font-black text-brand-brown">
                      {h.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  )
}

export { ContactSection }
