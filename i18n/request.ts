import { getRequestConfig } from "next-intl/server"

import { defaultLocale } from "./routing"

// Single-locale setup (no i18n routing). Every request resolves to Hebrew.
// When more locales are added, resolve `locale` from the request/cookie here.
export default getRequestConfig(async () => {
  const locale = defaultLocale

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
