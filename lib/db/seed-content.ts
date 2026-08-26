import type { Localized, LocalizedList } from "@/lib/localized"

/**
 * Starting content for a new location.
 *
 * This is the shape `bun run db:seed` writes and what "duplicate location"
 * copies, so a fresh branch opens with a complete, publishable site that the
 * admin then edits rather than an empty shell.
 */

const l = (he: string, en: string): Localized => ({ he, en })
const list = (he: string[], en: string[]): LocalizedList => ({ he, en })

export interface LocationBlueprint {
  slug: string
  name: Localized
  isPublished: boolean
  sortOrder: number
  contact: {
    city: Localized
    address: Localized
    phone: string
    whatsapp: string
    email: string
    leadRecipientEmail: string
  }
  /** `[opensAt, closesAt, isClosed]` per weekday, Sunday first. */
  hours: [string, string, boolean][]
}

export const LOCATION_BLUEPRINTS: LocationBlueprint[] = [
  {
    slug: "kiryat-ono",
    name: l("בלונה קרית אונו", "Baloona Kiryat Ono"),
    isPublished: true,
    sortOrder: 0,
    contact: {
      city: l("קרית אונו", "Kiryat Ono"),
      address: l(
        "רחוב שלמה המלך 37 (קניון קרית אונו) בניין B קומה מינוס 2",
        "37 Shlomo HaMelech St. (Kiryat Ono Mall), Building B, floor -2"
      ),
      phone: "03-1234567",
      whatsapp: "972501234567",
      email: "hello@baloona.co.il",
      leadRecipientEmail: "hello@baloona.co.il",
    },
    hours: [
      ["09:00", "19:00", false],
      ["09:00", "19:00", false],
      ["09:00", "19:00", false],
      ["09:00", "19:00", false],
      ["09:00", "19:00", false],
      ["09:00", "15:00", false],
      ["09:00", "19:00", false],
    ],
  },
  {
    slug: "ganei-tikva",
    name: l("בלונה גני תקווה", "Baloona Ganei Tikva"),
    isPublished: true,
    sortOrder: 1,
    contact: {
      city: l("גני תקווה", "Ganei Tikva"),
      address: l("רחוב הגליל 5, גני תקווה", "5 HaGalil St., Ganei Tikva"),
      phone: "03-7654321",
      whatsapp: "972501234568",
      email: "ganeitikva@baloona.co.il",
      leadRecipientEmail: "ganeitikva@baloona.co.il",
    },
    hours: [
      ["09:00", "19:00", false],
      ["09:00", "19:00", false],
      ["09:00", "19:00", false],
      ["09:00", "19:00", false],
      ["09:00", "19:00", false],
      ["09:00", "15:00", false],
      ["09:00", "19:00", false],
    ],
  },
]

export const siteContent = (city: Localized) => ({
  footerTagline: l(
    `מתחם ג׳ימבורי ויום הולדת לילדים בגילאי 1–9 ב${city.he}.`,
    `An indoor playground and birthday venue for kids aged 1–9 in ${city.en}.`
  ),
  contactTitle: l("צרו קשר", "Contact us"),
  contactEyebrow: l(
    "משאירים לנו הודעה — נחזור אליכם בשעות הפעילות",
    "Leave us a message — we'll get back to you during opening hours"
  ),
})

export const homeContent = {
  heroTitle: l(
    "משחקייה ובית קפה — להורים ולילדים",
    "A playground & café — for parents and kids"
  ),
  heroDescription: l(
    "מתחם ג׳ימבורי ענק של 3 קומות לילדים בגילאי 1–9. לשבת עם הקטנים וליהנות גם אנחנו. מזנון, חדר יום הולדת פרטי וצוות מסביר פנים.",
    "A huge 3-floor indoor playground for kids aged 1–9. Sit back with the little ones and enjoy it too. A café, a private birthday room and a warm, welcoming team."
  ),
  heroImages: [
    "/assets/gallery/gallery-1.png",
    "/assets/gallery/gallery-2.png",
    "/assets/gallery/gallery-3.png",
  ],
  aboutTitle: l("מקום אחד לכל המשפחה", "One place for the whole family"),
  aboutBody: l(
    "אנחנו מאמינים שאפשר להיות הורים ועדיין ליהנות מרגע לעצמנו. לכן בנינו מרחב גדול ויפה, עם בית קפה שפתוח לאורך כל היום, לצד חוגים, סדנאות וימי הולדת — ממש ליד אזור משחקים ענק, מאובזר, בטיחותי ונקי. הכל תחת קורת גג אחת.",
    "We believe you can be a parent and still enjoy a moment to yourself. So we built a big, beautiful space, with an all-day café alongside classes, workshops and birthdays — right next to a huge, well-equipped, secure and clean play area. All under one roof."
  ),
  aboutImageUrl: "/assets/gallery/gallery-3.png",
  featuresCta: l("בואו להכיר את המתחם", "Come see the venue"),
  reassuranceTitle: l(
    "אל תדאגו, דאגנו לכם להכל!",
    "Don't worry — we've got it all covered!"
  ),
  reassuranceBody: l(
    "אספתם את הילדים מהמסגרת? בואו ישר אלינו. תבלו יחד זמן איכות, תיהנו מארוחת ערב בריאה, ותחזרו הביתה רק לאמבטיה חמימה, סיפור ולישון.",
    "Picked the kids up from daycare? Come straight to us. Spend quality time together, enjoy a healthy dinner, and head home for just a warm bath, a story and bed."
  ),
  reassuranceCta: l("בואו לבקר", "Come visit"),
  menuTeaserTitle: l("המזנון שלנו", "Our café"),
  menuTeaserBody: l(
    "כשהילדים משחקים — גם ההורים נהנים. יש לנו מזנון ביתי עם אוכל חם, קפה איכותי, מתוקים ואפילו בירה קרה לגדולים.",
    "While the kids play, the grown-ups enjoy it too: hot food, great coffee, sweets and even a cold beer."
  ),
  menuTeaserCta: l("לתפריט המלא", "See the full menu"),
  birthdayTeaserTitle: l(
    "חוגגים יום הולדת בבלונה!",
    "Celebrate a birthday at Baloona!"
  ),
  birthdayTeaserBody: l(
    "שעתיים של כיף עם גישה חופשית למתקנים, חדר פרטי, פיצה לכל ילד וטקס עוגה ע״י צוות המקום. מ-1,990 ₪ ל-25 ילדים.",
    "Two hours of fun with free access to the attractions, a private room, pizza for every child and a cake ceremony by our team. From 1,990 ₪ for 25 kids."
  ),
  birthdayTeaserCta: l("לכל הפרטים", "See all the details"),
  birthdayTeaserImageUrl: "/birthday.png",
  galleryTitle: l("הצצה קטנה למתחם", "A little peek at the venue"),
  reviewsTitle: l("הורים מספרים", "What parents say"),
}

export const homeFeatureRows = [
  {
    title: l("אזור משחקים מזמין", "An inviting play area"),
    description: l(
      "מרחב אסתטי ונעים לתינוקות, לפעוטות ולילדים",
      "A pleasant, well-designed space for babies, toddlers and kids"
    ),
  },
  {
    title: l("בית קפה להורים", "A café for parents"),
    description: l(
      "קפה, מתוקים וכיבוד — לכם ולילדים, לאורך כל היום",
      "Coffee, sweets and snacks — for you and the kids, all day long"
    ),
  },
  {
    title: l("חוגים וימי הולדת", "Classes & birthdays"),
    description: l(
      "חוגי התפתחות, סדנאות, הרצאות העשרה וחגיגות",
      "Developmental classes, workshops, enrichment talks and celebrations"
    ),
  },
]

export const menuTeaserTileRows = [
  l("אוכל חם", "Hot food"),
  l("קפה ושתייה", "Coffee & drinks"),
  l("מתוקים", "Sweets"),
  l("לגדולים", "For grown-ups"),
  l("המלצות השף", "Chef's picks"),
  l("מוגש במקום", "Served here"),
].map((label) => ({ label }))

export const pricingContent = {
  title: l("מחירון", "Pricing"),
  note: l(
    "* הכניסה עבור ילד ומלווה. כל מלווה נוסף בתוספת 20 ₪. כניסה יומית.",
    "* Admission covers one child and one guardian. Each additional guardian is +20 ₪. Daily entry."
  ),
  rules: list(
    [
      "הכניסה עבור ילד ומלווה; כל מלווה נוסף בתוספת 20 ₪.",
      "כניסה יומית — אפשר לצאת ולחזור באותו יום.",
      "הכניסה לילדים מחייבת השגחת מבוגר מגיל 16 ומעלה.",
    ],
    [
      "Admission covers one child and one guardian; each additional guardian is +20 ₪.",
      "Daily entry — you can come and go throughout the day.",
      "Children must be supervised by an adult aged 16 or over.",
    ]
  ),
}

export const priceTierRows = [
  {
    subtitle: l("אמצע השבוע", "Midweek"),
    title: l("א׳–ה׳", "Sun–Thu"),
    isFeatured: false,
    rows: [
      { label: l("עד גיל שנתיים", "Up to age 2"), amount: 39 },
      { label: l("מעל גיל שנתיים", "Over age 2"), amount: 49 },
    ],
  },
  {
    subtitle: l("סוף שבוע", "Weekend"),
    title: l("שישי–שבת", "Fri–Sat"),
    isFeatured: true,
    rows: [
      { label: l("עד גיל שנתיים", "Up to age 2"), amount: 45 },
      { label: l("מעל גיל שנתיים", "Over age 2"), amount: 55 },
    ],
  },
  {
    subtitle: l("כרטיסייה", "Punch card"),
    title: l("10 כניסות", "10 entries"),
    isFeatured: false,
    rows: [
      { label: l("עד גיל שנתיים", "Up to age 2"), amount: 350 },
      { label: l("מעל גיל שנתיים", "Over age 2"), amount: 450 },
    ],
  },
]

export const menuContent = {
  title: l("התפריט שלנו", "Our menu"),
  description: l(
    "אוכל טרי, קפה טוב ומתוקים לילדים — הכל במקום.",
    "Fresh food, good coffee and sweets for the kids — all in one place."
  ),
  note: l(
    "* התפריט מתעדכן מעת לעת ועשוי להשתנות לפי עונה ומלאי.",
    "* The menu is updated from time to time and may change by season and availability."
  ),
}

export const menuCategoryRows = [
  {
    label: l("אוכל", "Food"),
    items: [
      { name: l("נקניקיה בלחמניה", "Hot dog in a bun"), amount: 15 },
      {
        name: l("טוסט סוגר פינה", "Corner toastie"),
        description: l(
          "גבינה צהובה, עגבניה, מלפפון",
          "Yellow cheese, tomato, cucumber"
        ),
        amount: 28,
      },
      {
        name: l("פיצה אישית", "Personal pizza"),
        description: l("רוטב עגבניות + מוצרלה", "Tomato sauce + mozzarella"),
        amount: 32,
      },
      { name: l("טוסט 4 גבינות", "Four-cheese toastie"), amount: 32 },
      {
        name: l("מיני פרצלס", "Mini pretzels"),
        description: l("מוגשים עם ממרח גבינה", "Served with cheese dip"),
        amount: 32,
      },
      {
        name: l("פיצה זוגית", "Sharing pizza"),
        description: l(
          "תוספת: ירקות / טונה – 6 ₪",
          "Add vegetables / tuna – 6 ₪"
        ),
        amount: 45,
      },
    ],
  },
  {
    label: l("מתוקים", "Sweets"),
    items: [
      {
        name: l("כדור שוקולד/קוקוס", "Chocolate / coconut ball"),
        amount: 5,
      },
      { name: l("גלידה אמריקאית", "American ice cream"), amount: 10 },
      {
        name: l("פאדג׳ שוקולד", "Chocolate fudge"),
        description: l(
          "עוגת שוקולד חמה עם גלידה",
          "Warm chocolate cake with ice cream"
        ),
        amount: 28,
      },
      {
        name: l("ופל בלגי", "Belgian waffle"),
        description: l("עם אבקת סוכר ונוטלה", "With icing sugar and Nutella"),
        amount: 28,
      },
    ],
  },
  {
    label: l("שתייה חמה", "Hot drinks"),
    items: [
      { name: l("תה", "Tea"), amount: 8 },
      { name: l("אספרסו קצר", "Single espresso"), amount: 8 },
      { name: l("אספרסו כפול", "Double espresso"), amount: 10 },
      { name: l("הפוך", "Latte"), amount: 12 },
      { name: l("קפה קר", "Iced coffee"), amount: 12 },
      { name: l("שוקו חם", "Hot chocolate"), amount: 12 },
      { name: l("תוספת סויה", "Soy milk"), amount: 2 },
    ],
  },
  {
    label: l("שתייה קלה", "Cold drinks"),
    items: [
      { name: l("מים / סודה", "Water / soda"), amount: 8 },
      { name: l("מיץ ענבים / תפוזים", "Grape / orange juice"), amount: 10 },
      { name: l("מים בטעמים", "Flavoured water"), amount: 10 },
      { name: l("קולה / זירו / ספרייט", "Cola / Zero / Sprite"), amount: 10 },
      { name: l("ברד", "Slushie"), amount: 10 },
      { name: l("פיוזטי", "Fuze Tea"), amount: 12 },
      { name: l("שייק פירות", "Fruit shake"), amount: 22 },
    ],
  },
  {
    label: l("לגדולים", "For grown-ups"),
    items: [
      { name: l("גולדסטאר", "Goldstar"), amount: 20 },
      { name: l("סטלה", "Stella"), amount: 25 },
      { name: l("קורונה", "Corona"), amount: 25 },
      { name: l("יין מבעבע בטעמים", "Flavoured sparkling wine"), amount: 25 },
    ],
  },
]

export const birthdayContent = {
  heroTitle: l("חוגגים יום הולדת בבלונה!", "Celebrate a birthday at Baloona!"),
  heroDescription: l(
    "שעתיים של כיף עם גישה חופשית למתקנים, חדר פרטי, פיצה לכל ילד וטקס עוגה ע״י צוות המקום.",
    "Two hours of fun with free access to the attractions, a private room, pizza for every child and a cake ceremony by our team."
  ),
  heroImageUrl: "/assets/birthday-hero.png",
  stepsTitle: l("איך זה עובד?", "How it works"),
  stepsNote: l(
    "* במהלך כל האירוע מסופקים לילדים קנקני מים ופטל באופן חופשי, ללא עלות.",
    "* Free jugs of water and cordial are provided to the children throughout the event."
  ),
  packageTitle: l("חבילת יום הולדת", "Birthday package"),
  packageAmount: 1990,
  packageChildrenCount: 25,
  extraChildAmount: 49,
  includedTitle: l("מה כלול בחבילה", "What's included"),
  depositAmount: 400,
  depositNote: l(
    "מקדמה לשריון: 400 ₪ (תקוזז מהסכום הסופי)",
    "Booking deposit: 400 ₪ (deducted from the final amount)"
  ),
  upgradesTitle: l("תוספות ושדרוגים", "Add-ons & upgrades"),
  rulesTitle: l("חוקים חשובים", "Important rules"),
  rules: list(
    [
      "בשישי החל מ-15:00 סגור לקהל הרחב בתוספת 1000 ₪.",
      "איסור מוחלט על פיניאטות, תותחי קונפטי וקומקום/מייחם.",
      "אח/בן משפחה נוסף חייב בכרטיס כניסה.",
    ],
    [
      "From 15:00 on Fridays the venue can be closed to the public for an extra 1,000 ₪.",
      "Piñatas, confetti cannons and kettles/urns are strictly forbidden.",
      "Siblings and other family members require an entry ticket.",
    ]
  ),
  formTitle: l(
    "טופס אישור והתחייבות לאירוע",
    "Event confirmation & commitment form"
  ),
  formDescription: l(
    "מלאו את הפרטים, בחרו את השדרוגים הרצויים וחתמו בתחתית הטופס.",
    "Fill in your details, pick the upgrades you want and sign at the bottom."
  ),
  cancellationPolicy: l(
    "ביטול עד 14 יום — לא תוחזר מקדמה. 3-14 ימים — קנס 50%. פחות מ-72 שעות — חיוב מלא.",
    "Cancellation over 14 days ahead — the deposit is not refunded. 3–14 days — a 50% fee. Under 72 hours — full charge."
  ),
  consentLabel: l(
    "אנחנו מתחייבים שקראנו את כל התנאים וההגבלות ומאשרים את כל הכתוב",
    "We confirm we have read all the terms and conditions and accept them"
  ),
  disclaimer: l(
    "שליחת הטופס אינה מהווה אישור לקיום האירוע; אישור סופי נקבע מול הפקידה.",
    "Submitting this form does not confirm the event; final confirmation is arranged with the office."
  ),
  successMessage: l(
    "הטופס נשלח! נחזור אליכם בהקדם לתיאום האירוע. תודה 🎈",
    "Your form was sent! We'll get back to you shortly to arrange the event. Thank you 🎈"
  ),
  requiresSignature: true,
  signatureTitle: l("חתימה דיגיטלית", "Digital signature"),
  signatureHint: l(
    "חתמו כאן עם העכבר או האצבע",
    "Sign here with your mouse or finger"
  ),
}

export const birthdayStepRows = [
  {
    title: l("גישה חופשית למתקנים", "Free access to the attractions"),
    subtitle: l(
      "שעתיים של כיף + חדר פרטי",
      "Two hours of fun + a private room"
    ),
    imageUrl: "/assets/birthday-steps/facilities.png",
  },
  {
    title: l("פיצה וטרופית", "Pizza & juice"),
    subtitle: l("2 משולשי פיצה לכל ילד", "Two pizza slices per child"),
    imageUrl: "/assets/birthday-steps/pizza.png",
  },
  {
    title: l("מים ופטל חופשי", "Free water & cordial"),
    subtitle: l("קנקנים לאורך כל האירוע", "Jugs throughout the event"),
    imageUrl: "/assets/birthday-steps/drinks.png",
  },
  {
    title: l("טקס עוגה", "Cake ceremony"),
    subtitle: l("ע״י צוות המקום", "Run by our team"),
    imageUrl: "/assets/birthday-steps/cake.png",
  },
]

export const birthdayPackageLineRows = [
  l(
    "שעתיים גישה חופשית למתקנים",
    "Two hours of free access to the attractions"
  ),
  l("חדר יום הולדת פרטי", "A private birthday room"),
  l("2 משולשי פיצה וטרופית לכל ילד", "Two pizza slices and a juice per child"),
  l("קנקני מים ופטל חופשי", "Free jugs of water and cordial"),
  l("טקס עוגה ע״י צוות המקום", "A cake ceremony run by our team"),
].map((text) => ({ text }))

export const birthdayUpgradeRows = [
  { label: l("10 כוסות קפה", "10 cups of coffee"), amount: 90 },
  { label: l("קילו כדורי שוקולד", "1kg of chocolate balls"), amount: 130 },
  { label: l("כוס ברד לכל ילד", "A slushie per child"), amount: 6 },
]

/**
 * The booking form's default questions. `fullName`, `phone` and `email` are
 * mirrored onto the lead's own columns so the inbox can list and search them;
 * every other answer is stored as key/value under `formData`.
 */
export const birthdayFormFieldRows = [
  {
    key: "eventDate",
    label: l("תאריך אירוע מבוקש", "Requested event date"),
    type: "date" as const,
    isRequired: true,
  },
  {
    key: "celebrantNames",
    label: l("שמות החוגגים", "Names of the celebrants"),
    placeholder: l("שם הילד/ה החוגג/ת", "The birthday child's name"),
    type: "text" as const,
    isRequired: true,
  },
  {
    key: "guestsCount",
    label: l("מספר משתתפים", "Number of guests"),
    placeholder: l("מינ. 25 ילדים", "Min. 25 children"),
    type: "number" as const,
    minValue: 25,
    isRequired: true,
  },
  {
    key: "allergies",
    label: l("אלרגיות", "Allergies"),
    placeholder: l("פרטו אם יש", "Tell us if there are any"),
    type: "textarea" as const,
    isRequired: false,
  },
  {
    key: "fullName",
    label: l("שם המזמין", "Booker's name"),
    placeholder: l("ישראל ישראלי", "Jane Doe"),
    type: "text" as const,
    isRequired: true,
  },
  {
    key: "idNumber",
    label: l("ת.ז", "ID number"),
    placeholder: l("000000000", "000000000"),
    type: "id" as const,
    isRequired: true,
  },
  {
    key: "phone",
    label: l("טלפון", "Phone"),
    placeholder: l("050-0000000", "050-0000000"),
    type: "tel" as const,
    isRequired: true,
  },
  {
    key: "email",
    label: l("מייל", "Email"),
    placeholder: l("name@example.com", "name@example.com"),
    type: "email" as const,
    isRequired: true,
  },
]

export const contactSubjectRows = [
  l("בירור כללי", "General enquiry"),
  l("הזמנת ביקור", "Book a visit"),
  l("יום הולדת", "Birthday"),
  l("אירוע פרטי", "Private event"),
  l("הצעת שיפור", "Feedback"),
].map((label) => ({ label }))

export const galleryImageRows = [
  { url: "/assets/gallery/gallery-1.png", alt: l("מתחם המשחקים", "Play area") },
  { url: "/assets/gallery/gallery-2.png", alt: l("פינת הקפה", "Café corner") },
  {
    url: "/assets/gallery/gallery-3.png",
    alt: l("ילדים משחקים", "Kids playing"),
  },
  { url: "/assets/gallery/gallery-4.png", alt: l("רגעים מהמתחם", "Moments") },
  {
    url: "/assets/gallery/gallery-5.png",
    alt: l("חוגגים אצלנו", "Celebrating here"),
  },
  {
    url: "/assets/gallery/gallery-6.png",
    alt: l("בריכת הכדורים", "Ball pit"),
  },
]

/*
 * There are deliberately no starter reviews.
 *
 * Every other row here is generic copy about Baloona that an editor rewrites.
 * A review is different in kind: it is a statement attributed to a named
 * customer, and inventing one puts words in a stranger's mouth on a live site.
 * A new branch starts with an empty reviews section — which renders nothing —
 * until real ones are written in ניהול ביקורות or synced from Google.
 */

export const announcementContent = {
  isActive: false,
  version: 1,
  title: l("עדכון שעות פתיחה", "Opening hours update"),
  body: l(
    "שימו לב לשינויים בשעות הפעילות בחג הקרוב.",
    "Please note the changes to our opening hours over the coming holiday."
  ),
  lines: list(
    [
      "ביום שני נהיה פתוחים 09:30–18:00",
      "בערב החג נפתח 09:30–14:00",
      "ביום החג נהיה סגורים כל היום.",
    ],
    [
      "On Monday we're open 09:30–18:00",
      "On the eve of the holiday we open 09:30–14:00",
      "On the holiday itself we're closed all day.",
    ]
  ),
  ctaLabel: l("הבנתי, תודה", "Got it, thanks"),
  ctaHref: null,
}

export const seoEntryRows = (city: Localized) => [
  {
    page: "home" as const,
    title: l(
      `בלונה ${city.he} · ג׳ימבורי, ימי הולדת ומזנון`,
      `Baloona ${city.en} · Indoor playground, birthdays & café`
    ),
    description: l(
      `בלונה הוא מתחם ג׳ימבורי לילדים בגילאי 1–9 ב${city.he}. 3 קומות משחקים, חדר יום הולדת פרטי ומזנון טרי להורים ולילדים.`,
      `Baloona is an indoor playground for kids aged 1–9 in ${city.en}. Three floors of play, a private birthday room and a fresh café for parents and kids.`
    ),
    keywords: l(
      `בלונה, ג׳ימבורי, ילדים, יום הולדת, ${city.he}`,
      `Baloona, indoor playground, kids, birthday, ${city.en}`
    ),
  },
  {
    page: "menu" as const,
    title: l(`התפריט של בלונה ${city.he}`, `The menu at Baloona ${city.en}`),
    description: l(
      "אוכל חם, קפה איכותי, מתוקים ושתייה קרה — התפריט המלא של המזנון בבלונה.",
      "Hot food, great coffee, sweets and cold drinks — the full Baloona café menu."
    ),
    keywords: null,
  },
  {
    page: "birthdays" as const,
    title: l(`ימי הולדת בבלונה ${city.he}`, `Birthdays at Baloona ${city.en}`),
    description: l(
      "חבילת יום הולדת עם חדר פרטי, גישה חופשית למתקנים, פיצה לכל ילד וטקס עוגה.",
      "A birthday package with a private room, free access to the attractions, pizza for every child and a cake ceremony."
    ),
    keywords: null,
  },
]
