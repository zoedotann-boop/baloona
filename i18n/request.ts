import { cookies } from "next/headers"
import { getRequestConfig } from "next-intl/server"

import { defaultLocale, isLocale } from "./routing"

// Locale is resolved from the `NEXT_LOCALE` cookie set by the language
// switcher, falling back to Hebrew for first-time visitors.
export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value
  const locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
