import { ChevronLeft } from "lucide-react"
import { useTranslations } from "next-intl"

import { Reveal } from "@/components/brand/reveal"
import { ContactForm } from "@/components/home/contact-form"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import type { ContactDetails, HoursRow } from "@/lib/view-models"

interface ContactSectionProps {
  locationId: string
  title: string
  eyebrow: string
  contact: ContactDetails
  hours: HoursRow[]
  subjects: string[]
}

/** Contact block: readable contact details beside a message form, on lavender. */
function ContactSection({
  locationId,
  title,
  eyebrow,
  contact,
  hours,
  subjects,
}: ContactSectionProps) {
  const t = useTranslations("contact")
  const hoursLabel = useTranslations("hours")

  const details = [
    {
      label: t("whatsappLabel"),
      value: t("whatsappValue"),
      href: contact.whatsappHref,
      external: true,
    },
    {
      label: t("phoneLabel"),
      value: contact.phone,
      href: contact.telHref,
      external: false,
    },
    {
      label: t("emailLabel"),
      value: contact.email,
      href: contact.mailHref,
      external: false,
    },
    {
      label: t("addressLabel"),
      value: contact.address,
      href: contact.wazeHref,
      external: true,
    },
  ]

  return (
    <Section id="contact" className="bg-accent text-white">
      <Container>
        <Reveal className="mb-12 text-center">
          <h2 className="font-heading text-[clamp(34px,4.5vw,50px)] font-black">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[20px] leading-relaxed text-white/80">
            {eyebrow}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="space-y-2">
              {details.map((detail) => (
                <a
                  key={detail.label}
                  href={detail.href}
                  target={detail.external ? "_blank" : undefined}
                  rel={detail.external ? "noopener noreferrer" : undefined}
                  className="group -mx-4 flex items-center justify-between gap-4 rounded-2xl px-4 py-3 transition hover:bg-white/10"
                >
                  <span>
                    <span className="block text-[15px] font-bold text-white/70">
                      {detail.label}
                    </span>
                    <span className="block text-[20px] text-white underline decoration-white/40 decoration-2 underline-offset-4">
                      {detail.value}
                    </span>
                  </span>
                  <ChevronLeft className="size-6 shrink-0 text-white/80 transition group-hover:-translate-x-1" />
                </a>
              ))}

              <div className="px-4 pt-4">
                <span className="block text-[15px] font-bold text-white/70">
                  {hoursLabel("title")}
                </span>
                <div className="mt-1 space-y-1 text-[20px] text-white">
                  {hours.map((row) => (
                    <div key={row.days}>
                      {row.days} · {row.time}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <ContactForm locationId={locationId} subjects={subjects} />
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}

export { ContactSection }
