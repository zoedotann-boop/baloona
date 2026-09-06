const WHATSAPP_MESSAGE = "היי הגעתי אליכם דרך האתר..."

export function locationPaths(slug: string) {
  const base = `/${slug}`
  return {
    home: base,
    menu: `${base}/menu`,
    birthdays: `${base}/birthdays`,
    accessibility: `${base}/accessibility`,
    terms: `${base}/terms`,
    pricing: `${base}#pricing`,
    shop: `${base}#shop`,
    contact: `${base}#contact`,
  }
}

export type LocationPaths = ReturnType<typeof locationPaths>

export function whatsappLink(
  whatsapp: string,
  message: string = WHATSAPP_MESSAGE
): string {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`
}

export function wazeLink(address: string): string {
  return `https://waze.com/ul?q=${encodeURIComponent(address)}&navigate=yes`
}

export function telLink(phone: string): string {
  return `tel:${phone.replace(/[^0-9+]/g, "")}`
}

export function mailLink(email: string): string {
  return `mailto:${email}`
}
