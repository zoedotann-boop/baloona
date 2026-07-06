import Image from "next/image"
import { useTranslations } from "next-intl"

import { Icon } from "@/components/brand/icon"
import { SectionEyebrow } from "@/components/brand/section-eyebrow"
import { ContactForm } from "@/components/home/contact-form"
import { BALOONA, CONTACT_METHODS } from "@/lib/site-content"

/** Contact block: quick methods + opening hours + a message form. */
function ContactSection() {
  const t = useTranslations("contact")

  return (
    <section id="contact" className="px-5 py-16 md:px-9">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <SectionEyebrow>{t("eyebrow")}</SectionEyebrow>
          <h2 className="mt-1 font-heading text-[40px] font-black text-brand-brown">
            {t("title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="mb-6 grid grid-cols-2 gap-4 rounded-[22px] border border-[#f3d3d9] bg-[#fbede0] p-5">
              {CONTACT_METHODS.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  {...(c.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="flex flex-col items-center text-center transition hover:opacity-80 active:scale-[.98]"
                >
                  <Image
                    src={c.image}
                    alt={c.label}
                    width={48}
                    height={48}
                    className="mb-3 size-12 object-contain"
                  />
                  <div className="text-[14px] font-bold text-brand-brown">
                    {c.label}
                  </div>
                  <div className="mt-0.5 text-[12px] text-brand-muted">
                    {c.sub}
                  </div>
                </a>
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
