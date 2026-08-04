import { locationPaths, whatsappLink } from "@/lib/site-links"
import type { ContactDetails, HoursRow } from "@/lib/view-models"

/**
 * Sample content for Storybook.
 *
 * Sections take plain, already-localized props, so stories can render the real
 * components without a database or an intl namespace behind them.
 */

export const storyPaths = locationPaths("kiryat-ono")

export const storyHours: HoursRow[] = [
  { days: "א׳–ה׳", time: "09:00–19:00" },
  { days: "שישי", time: "09:00–15:00" },
  { days: "שבת", time: "09:00–19:00" },
]

export const storyContact: ContactDetails = {
  phone: "03-1234567",
  email: "hello@baloona.co.il",
  address: "רחוב שלמה המלך 37 (קניון קרית אונו) בניין B קומה מינוס 2",
  whatsappHref: whatsappLink("972501234567"),
  wazeHref: "https://waze.com/ul?q=Baloona&navigate=yes",
  telHref: "tel:031234567",
  mailHref: "mailto:hello@baloona.co.il",
  instagramUrl: "https://instagram.com/baloona",
  facebookUrl: "https://facebook.com/baloona",
}

export const storyGallery = [
  { id: "1", url: "/assets/gallery/gallery-1.png", alt: "מתחם המשחקים" },
  { id: "2", url: "/assets/gallery/gallery-2.png", alt: "פינת הקפה" },
  { id: "3", url: "/assets/gallery/gallery-3.png", alt: "ילדים משחקים" },
  { id: "4", url: "/assets/gallery/gallery-4.png", alt: "רגעים מהמתחם" },
  { id: "5", url: "/assets/gallery/gallery-5.png", alt: "חוגגים אצלנו" },
  { id: "6", url: "/assets/gallery/gallery-6.png", alt: "בריכת הכדורים" },
]

export const storySubjects = [
  "בירור כללי",
  "הזמנת ביקור",
  "יום הולדת",
  "אירוע פרטי",
  "הצעת שיפור",
]

export const storyLocationId = "00000000-0000-4000-8000-000000000000"
