import { getTranslations } from "next-intl/server"

import { loadSiteChrome } from "@/lib/site-view"

interface AccessibilitySection {
  title: string
  body?: string[]
  list?: string[]
}

export async function generateMetadata({
  params,
}: PageProps<"/[location]/accessibility">) {
  const { location } = await params
  const [{ chrome }, t] = await Promise.all([
    loadSiteChrome(location),
    getTranslations("accessibility"),
  ])
  return {
    title: `${t("title")} · ${chrome.slug}`,
    description: t("intro"),
  }
}

/** Legal accessibility statement, with the branch's own contact details. */
export default async function AccessibilityPage({
  params,
}: PageProps<"/[location]/accessibility">) {
  const { location: slug } = await params
  const [{ contact }, t] = await Promise.all([
    loadSiteChrome(slug),
    getTranslations("accessibility"),
  ])

  const sections = t.raw("sections") as AccessibilitySection[]

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
        </div>
      </section>

      <section className="px-5 py-14 md:px-9 md:py-16">
        <div className="mx-auto flex max-w-3xl flex-col gap-9">
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
              {section.list && (
                <ul className="mt-1 space-y-2">
                  {section.list.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-[17px] leading-relaxed text-muted-foreground"
                    >
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div className="rounded-[26px] border border-border bg-brand-pink-soft p-6 md:p-8">
            <h2 className="mb-3 font-heading text-[26px] font-black text-brand-plum">
              {t("contactTitle")}
            </h2>
            <p className="text-[17px] leading-relaxed text-muted-foreground">
              {t("contactBody")}
            </p>
            <div className="mt-4 flex flex-col gap-2 text-[17px] font-bold text-foreground">
              <a href={contact.telHref}>
                {t("phoneLabel")}: {contact.phone}
              </a>
              <a href={contact.mailHref}>
                {t("emailLabel")}: {contact.email}
              </a>
              <span className="font-normal text-muted-foreground">
                {t("addressLabel")}: {contact.address}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
