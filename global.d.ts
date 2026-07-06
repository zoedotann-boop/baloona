import type { Locale } from "./i18n/routing"
import type messages from "./messages/he.json"

// Type-safe next-intl: message keys and the supported locale are checked.
declare module "next-intl" {
  interface AppConfig {
    Locale: Locale
    Messages: typeof messages
  }
}
