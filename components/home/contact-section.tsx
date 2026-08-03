import { ChevronLeft } from "lucide-react"
import { useTranslations } from "next-intl"

import { Reveal } from "@/components/brand/reveal"
import { ContactForm } from "@/components/home/contact-form"
import {
  BALOONA,
  mailLink,
  telLink,
  wazeLink,
  whatsappLink,
} from "@/lib/site-content"

/** Contact block: readable contact details beside a message form, on lavender. */
function ContactSection() {
  const t = useTranslations("contact")

  const details = [
    {
      label: "וואטסאפ",
      value: "שלחו לנו הודעה",
      href: whatsappLink(),
      external: true,
    },
    { label: "טלפון", value: BALOONA.phone, href: telLink(), external: false },
    {
      label: "אימייל",
      value: BALOONA.email,
      href: mailLink(),
      external: false,
    },
    {
      label: "כתובת",
      value: BALOONA.address,
      href: wazeLink(),
      external: true,
    },
  ]

  return (
    <section
      id="contact"
      className="bg-accent px-5 py-20 text-white md:px-9 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-12 text-center">
          <h2 className="font-heading text-[clamp(34px,4.5vw,50px)] font-black">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[20px] leading-relaxed text-white/80">
            {t("eyebrow")}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="space-y-2">
              {details.map((d) => (
                <a
                  key={d.label}
                  href={d.href}
                  target={d.external ? "_blank" : undefined}
                  rel={d.external ? "noopener noreferrer" : undefined}
                  className="group -mx-4 flex items-center justify-between gap-4 rounded-2xl px-4 py-3 transition hover:bg-white/10"
                >
                  <span>
                    <span className="block text-[15px] font-bold text-white/70">
                      {d.label}
                    </span>
                    <span className="block text-[20px] text-white underline decoration-white/40 decoration-2 underline-offset-4">
                      {d.value}
                    </span>
                  </span>
                  <ChevronLeft className="size-6 shrink-0 text-white/80 transition group-hover:-translate-x-1" />
                </a>
              ))}

              <div className="px-4 pt-4">
                <span className="block text-[15px] font-bold text-white/70">
                  שעות פתיחה
                </span>
                <div className="mt-1 space-y-1 text-[20px] text-white">
                  {BALOONA.hours.map((h) => (
                    <div key={h.days}>
                      {h.days} · {h.time}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export { ContactSection }
