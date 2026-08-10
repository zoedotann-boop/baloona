import { notFound } from "next/navigation"
import { getLocale, getTranslations } from "next-intl/server"

import { type Locale } from "@/i18n/routing"
import { getTermsPage } from "@/lib/db/queries/site"
import { pickLocale } from "@/lib/localized"

interface TermsSection {
  title: string
  body?: string[]
}

export async function generateMetadata({
  params,
}: PageProps<"/[location]/terms">) {
  const { location } = await params
  const t = await getTranslations("terms")
  return { title: `${t("title")} · ${location}`, description: t("intro") }
}

/**
 * Terms & Cancellation policy — a per-branch page on the full site chrome (so
 * visitors can navigate away), rendering the branch's editable body and falling
 * back to the default copy in `messages` while that is empty.
 */
export default async function TermsPage({
  params,
}: PageProps<"/[location]/terms">) {
  const { location: slug } = await params
  const [data, locale, t] = await Promise.all([
    getTermsPage(slug),
    getLocale() as Promise<Locale>,
    getTranslations("terms"),
  ])

  if (!data) notFound()

  const body = pickLocale(data.site?.terms, locale).trim()
  const sections = t.raw("sections") as TermsSection[]

  return (
    <div className="bg-white">
      <section className="bg-brand-lavender-soft px-5 py-16 text-center md:px-9 md:py-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-heading text-[clamp(34px,5vw,52px)] leading-[1.08] font-black text-brand-plum">
            {t("title")}
          </h1>
          <p className="mx-auto mt-5 max-w-[520px] text-[17px] leading-relaxed text-brand-plum">
            {t("intro")}
          </p>
          <p className="mt-3 text-[14px] text-muted-foreground">
            {t("lastUpdated")}
          </p>
        </div>
      </section>

      <section className="px-5 py-14 md:px-9 md:py-16">
        <div className="mx-auto max-w-3xl">
          {body ? (
            <div className="text-[17px] leading-relaxed whitespace-pre-line text-muted-foreground">
              {body}
            </div>
          ) : (
            <div className="flex flex-col gap-9">
              {sections.map((section) => (
                <div key={section.title}>
                  <h2 className="mb-3 font-heading text-[26px] font-black text-brand-plum">
                    {section.title}
                  </h2>
                  {section.body?.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="mb-3 text-[17px] leading-relaxed text-muted-foreground last:mb-0"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
