/**
 * Shapes shared by more than one presentational component.
 *
 * Pages resolve the database rows for the active locale and hand components
 * plain, already-formatted strings — components never see `Localized` values,
 * shekel amounts or the `Locale`, which keeps them trivially storyable.
 */

/** One printed line of opening hours, e.g. `א׳–ה׳ · 09:00–19:00`. */
export interface HoursRow {
  days: string
  time: string
}

/** Contact channels for a location, pre-resolved into hrefs. */
export interface ContactDetails {
  phone: string
  email: string
  address: string
  whatsappHref: string
  wazeHref: string
  telHref: string
  mailHref: string
  instagramUrl?: string
  facebookUrl?: string
  tiktokUrl?: string
}

/** Petal colors for the three feature icons, in order (lavender, rose, mint). */
export const FEATURE_COLORS = ["#b39ddb", "#dda99e", "#a7e8d0"]
