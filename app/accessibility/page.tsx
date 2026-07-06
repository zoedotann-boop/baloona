import type { Metadata } from "next"

import { SectionEyebrow } from "@/components/brand/section-eyebrow"
import { BALOONA, mailLink, telLink } from "@/lib/site-content"

export const metadata: Metadata = {
  title: "הצהרת נגישות · בלונה",
  description:
    "הצהרת הנגישות של מתחם בלונה — המחויבות שלנו להנגשת האתר והמתחם לכלל המבקרים.",
}

const SECTIONS = [
  {
    title: "המחויבות שלנו לנגישות",
    body: [
      "בלונה רואה חשיבות רבה במתן שירות שוויוני לכלל לקוחותינו ובשיפור השירות הניתן ללקוחות עם מוגבלות. אנו משקיעים מאמצים ומשאבים רבים בהנגשת האתר והמתחם, מתוך אמונה כי לכל אדם מגיעה הזכות לחיות בשוויון, כבוד, נוחות ועצמאות.",
    ],
  },
  {
    title: "נגישות האתר",
    body: [
      "אתר האינטרנט שלנו הונגש בהתאם להוראות תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג-2013, ולתקן הישראלי (ת״י 5568) המבוסס על הנחיות WCAG 2.1 ברמת AA.",
      "האתר נבנה בהתאמה לרוב הדפדפנים הנפוצים ולשימוש בטלפון סלולרי, ותומך בניווט באמצעות מקלדת ובקוראי מסך.",
    ],
  },
  {
    title: "התאמות הנגישות באתר",
    list: [
      "מבנה סמנטי ותקין המאפשר ניווט בטכנולוגיות מסייעות.",
      "ניגודיות צבעים תקינה בין הטקסט לרקע.",
      "טקסט חלופי (alt) לתמונות בעלות משמעות.",
      "אפשרות ניווט מלאה באמצעות המקלדת וסימון פוקוס ברור.",
      "התאמה לרוחב מסך ולתצוגה במכשירים ניידים.",
    ],
  },
  {
    title: "נגישות המתחם הפיזי",
    list: [
      "גישה נוחה לכניסת המתחם.",
      "שירותי נכים במקום.",
      "צוות אדיב ומסביר פנים שישמח לסייע בכל צורך.",
    ],
  },
  {
    title: "החרגות ומגבלות",
    body: [
      "אנו עושים כל מאמץ לשמור על נגישות האתר ולעדכנו באופן שוטף. יחד עם זאת, ייתכן ויימצאו חלקים או תכנים שטרם הונגשו במלואם או שאינם נגישים באופן מיטבי. אנו ממשיכים לפעול לשיפור הנגישות כחלק ממחויבותנו לאפשר שימוש נוח לכלל האוכלוסייה.",
    ],
  },
]

export default function AccessibilityPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-brand-sky px-5 py-16 text-center md:px-9 md:py-20">
        <div className="mx-auto max-w-3xl">
          <SectionEyebrow className="text-brand-sky-ink">
            {BALOONA.name}
          </SectionEyebrow>
          <h1 className="mt-3 font-heading text-[clamp(30px,5vw,46px)] leading-[1.08] font-black text-brand-brown">
            הצהרת נגישות
          </h1>
          <p className="mx-auto mt-5 max-w-[520px] text-[15px] leading-relaxed text-brand-sky-ink">
            אנו מאמינים שכל אחד ואחת צריכים ליהנות מהמתחם ומהאתר שלנו בנוחות
            ובעצמאות. ריכזנו כאן את פעולות הנגישות שביצענו ואת הדרך ליצור איתנו
            קשר.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-5 py-14 md:px-9 md:py-16">
        <div className="mx-auto flex max-w-3xl flex-col gap-9">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="mb-3 font-heading text-[22px] font-black text-brand-brown">
                {section.title}
              </h2>
              {section.body?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mb-3 text-[15px] leading-relaxed text-brand-muted last:mb-0"
                >
                  {paragraph}
                </p>
              ))}
              {section.list && (
                <ul className="mt-1 space-y-2">
                  {section.list.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-[15px] leading-relaxed text-brand-muted"
                    >
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* Contact for accessibility issues */}
          <div className="rounded-[26px] border border-[#f3d3d9] bg-brand-pink-soft p-6 md:p-8">
            <h2 className="mb-3 font-heading text-[22px] font-black text-brand-brown">
              פנייה בנושא נגישות
            </h2>
            <p className="text-[15px] leading-relaxed text-brand-muted">
              נתקלתם בבעיה או שיש לכם הצעה לשיפור הנגישות? נשמח לשמוע ולטפל בכל
              פנייה בהקדם. ניתן ליצור קשר עם רכז הנגישות שלנו:
            </p>
            <div className="mt-4 flex flex-col gap-2 text-[15px] font-bold text-brand-brown">
              <a href={telLink()} className="hover:text-primary">
                טלפון: {BALOONA.phone}
              </a>
              <a href={mailLink()} className="hover:text-primary">
                אימייל: {BALOONA.email}
              </a>
              <span className="font-normal text-brand-muted">
                כתובת: {BALOONA.address}
              </span>
            </div>
          </div>

          <p className="text-[13px] text-brand-muted">
            הצהרת הנגישות עודכנה לאחרונה ביולי 2026.
          </p>
        </div>
      </section>
    </div>
  )
}
