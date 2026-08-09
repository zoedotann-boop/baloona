import { getTranslations } from "next-intl/server"

interface TermsSection {
  title: string
  body?: string[]
  list?: string[]
}

export async function generateMetadata() {
  const t = await getTranslations("terms")
  return { title: t("title"), description: t("intro") }
}

/**
 * Terms & Conditions + Cancellation Policy. The legal copy is a placeholder in
 * `messages/he.json` (`terms.sections`) for a human to replace with the final
 * Hebrew text — same messages-`sections` + `t.raw()` shape as the accessibility
 * statement.
 */
export default async function TermsPage() {
  const t = await getTranslations("terms")
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
        </div>
      </section>
    </div>
  )
}
