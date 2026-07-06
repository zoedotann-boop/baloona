// Mock content for the Baloona site (single-locale Hebrew). Structural data
// lives here; presentational styling lives in the components.

export const NAV_LINKS = [
  { href: "/", key: "home" as const, label: "ראשי" },
  { href: "/menu", key: "menu" as const, label: "תפריט" },
  { href: "/birthdays", key: "birthdays" as const, label: "ימי הולדת" },
]

export const BALOONA = {
  name: "בלונה",
  address: "רחוב שלמה המלך 37 (קניון קרית אונו) בניין B קומה מינוס 2",
  phone: "03-1234567",
  whatsapp: "972501234567",
  email: "hello@baloona.co.il",
  hours: [
    { days: "א׳–ה׳", time: "09:00–19:00" },
    { days: "שישי", time: "09:00–15:00" },
    { days: "שבת", time: "09:00–19:00" },
  ],
}

// ---- Menu ----------------------------------------------------------------
export interface MenuItem {
  name: string
  price: string
  desc?: string
}

export const MENU_TABS = [
  { id: "food", label: "אוכל" },
  { id: "sweet", label: "מתוקים" },
  { id: "hot", label: "שתייה חמה" },
  { id: "cold", label: "שתייה קלה" },
  { id: "beer", label: "לגדולים" },
] as const

export type MenuTabId = (typeof MENU_TABS)[number]["id"]

export const MENU_DATA: Record<MenuTabId, MenuItem[]> = {
  food: [
    { name: "נקניקיה בלחמניה", price: "15 ₪" },
    {
      name: "טוסט סוגר פינה",
      price: "28 ₪",
      desc: "גבינה צהובה, עגבניה, מלפפון",
    },
    { name: "פיצה אישית", price: "32 ₪", desc: "רוטב עגבניות + מוצרלה" },
    { name: "טוסט 4 גבינות", price: "32 ₪" },
    { name: "מיני פרצלס", price: "32 ₪", desc: "מוגשים עם ממרח גבינה" },
    { name: "פיצה זוגית", price: "45 ₪", desc: "תוספת: ירקות / טונה – 6 ₪" },
  ],
  sweet: [
    { name: "כדור שוקולד/קוקוס", price: "5 ₪" },
    { name: "גלידה אמריקאית", price: "10 ₪" },
    { name: "פאדג׳ שוקולד", price: "28 ₪", desc: "עוגת שוקולד חמה עם גלידה" },
    { name: "ופל בלגי", price: "28 ₪", desc: "עם אבקת סוכר ונוטלה" },
  ],
  hot: [
    { name: "תה", price: "8 ₪" },
    { name: "אספרסו קצר", price: "8 ₪" },
    { name: "אספרסו כפול", price: "10 ₪" },
    { name: "הפוך", price: "12 ₪" },
    { name: "קפה קר", price: "12 ₪" },
    { name: "שוקו חם", price: "12 ₪" },
    { name: "תוספת סויה", price: "2 ₪" },
  ],
  cold: [
    { name: "מים / סודה", price: "8 ₪" },
    { name: "מיץ ענבים / תפוזים", price: "10 ₪" },
    { name: "מים בטעמים", price: "10 ₪" },
    { name: "קולה / זירו / ספרייט", price: "10 ₪" },
    { name: "ברד", price: "10 ₪" },
    { name: "פיוזטי", price: "12 ₪" },
    { name: "שייק פירות", price: "22 ₪" },
  ],
  beer: [
    { name: "גולדסטאר", price: "20 ₪" },
    { name: "סטלה", price: "25 ₪" },
    { name: "קורונה", price: "25 ₪" },
    { name: "יין מבעבע בטעמים", price: "25 ₪" },
  ],
}

export const MENU_TEASER_TILES = [
  { image: "/assets/menu-teaser/hot-food.png", label: "אוכל חם" },
  { image: "/assets/menu-teaser/coffee-drinks.png", label: "קפה ושתייה" },
  { image: "/assets/menu-teaser/sweets.png", label: "מתוקים" },
  { image: "/assets/menu-teaser/for-adults.png", label: "לגדולים" },
  {
    image: "/assets/menu-teaser/chef-recommendations.png",
    label: "המלצות השף",
  },
  { image: "/assets/menu-teaser/served-here.png", label: "מוגש במקום" },
] as const

// ---- Birthdays -----------------------------------------------------------
export const BDAY_STEPS = [
  {
    image: "/assets/birthday-steps/facilities.png",
    label: "גישה חופשית למתקנים",
    sub: "שעתיים של כיף + חדר פרטי",
  },
  {
    image: "/assets/birthday-steps/pizza.png",
    label: "פיצה וטרופית",
    sub: "2 משולשי פיצה לכל ילד",
  },
  {
    image: "/assets/birthday-steps/drinks.png",
    label: "מים ופטל חופשי",
    sub: "קנקנים לאורך כל האירוע",
  },
  {
    image: "/assets/birthday-steps/cake.png",
    label: "טקס עוגה",
    sub: "ע״י צוות המקום",
  },
] as const

export const BDAY_PACKAGE_LINES = [
  "שעתיים גישה חופשית למתקנים",
  "חדר יום הולדת פרטי",
  "2 משולשי פיצה וטרופית לכל ילד",
  "קנקני מים ופטל חופשי",
  "טקס עוגה ע״י צוות המקום",
]

export const BDAY_UPGRADES = [
  { icon: "coffee", label: "10 כוסות קפה", price: "90 ₪" },
  { icon: "gift", label: "קילו כדורי שוקולד", price: "130 ₪" },
  { icon: "cup", label: "כוס ברד לכל ילד", price: "6 ₪" },
] as const

export const BDAY_RULES = [
  "בשישי החל מ-15:00 סגור לקהל הרחב בתוספת 1000 ₪.",
  "איסור מוחלט על פיניאטות, תותחי קונפטי וקומקום/מייחם.",
]

export const BDAY_LEAD_FIELDS = [
  { label: "תאריך אירוע מבוקש", placeholder: "בחרו תאריך" },
  { label: "שמות החוגגים", placeholder: "שם הילד/ה החוגג/ת" },
  { label: "מספר משתתפים", placeholder: "מינ. 25 ילדים" },
  { label: "אלרגיות", placeholder: "פרטו אם יש" },
  { label: "שם המזמין", placeholder: "ישראל ישראלי" },
  { label: "ת.ז", placeholder: "000000000" },
  { label: "טלפון", placeholder: "050-0000000" },
  { label: "מייל", placeholder: "name@example.com" },
] as const

// ---- Contact -------------------------------------------------------------
export const CONTACT_METHODS = [
  {
    image: "/assets/contact/whatsapp.png",
    label: "וואטסאפ",
    sub: "תשובה מהירה",
  },
  { image: "/assets/contact/phone.png", label: "טלפון", sub: BALOONA.phone },
  { image: "/assets/contact/email.png", label: "אימייל", sub: BALOONA.email },
  { image: "/assets/contact/navigation.png", label: "ניווט", sub: "קרית אונו" },
] as const

export const CONTACT_SUBJECTS = [
  "בירור כללי",
  "הזמנת ביקור",
  "יום הולדת",
  "אירוע פרטי",
  "הצעת שיפור",
]
