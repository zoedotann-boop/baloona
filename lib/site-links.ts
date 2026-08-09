/** Default greeting prefilled when a visitor opens WhatsApp from the site. */
const WHATSAPP_MESSAGE = "היי הגעתי אליכם דרך האתר..."

/** Every public page of a location, so links never hard-code a slug. */
export function locationPaths(slug: string) {
  const base = `/${slug}`
  return {
    home: base,
    menu: `${base}/menu`,
    birthdays: `${base}/birthdays`,
    accessibility: `${base}/accessibility`,
    pricing: `${base}#pricing`,
    shop: `${base}#shop`,
    contact: `${base}#contact`,
  }
}

export type LocationPaths = ReturnType<typeof locationPaths>

/** WhatsApp chat link with the site's default prefilled message. */
export function whatsappLink(
  whatsapp: string,
  message: string = WHATSAPP_MESSAGE
): string {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`
}

/** Waze navigation link to a venue address. */
export function wazeLink(address: string): string {
  return `https://waze.com/ul?q=${encodeURIComponent(address)}&navigate=yes`
}

/** `tel:` link built from a phone number as typed in the admin. */
export function telLink(phone: string): string {
  return `tel:${phone.replace(/[^0-9+]/g, "")}`
}

/** `mailto:` link to a venue email. */
export function mailLink(email: string): string {
  return `mailto:${email}`
}
