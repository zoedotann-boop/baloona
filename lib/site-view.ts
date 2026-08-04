import "server-only"

import { notFound } from "next/navigation"
import { getLocale, getTranslations } from "next-intl/server"

import { type Locale } from "@/i18n/routing"
import { getLocationChrome, type LocationChrome } from "@/lib/db/queries/site"
import { pickLocale } from "@/lib/localized"
import {
  formatWeekdayRange,
  getOpenState,
  summarizeHours,
} from "@/lib/opening-hours"
import {
  locationPaths,
  mailLink,
  telLink,
  wazeLink,
  whatsappLink,
  type LocationPaths,
} from "@/lib/site-links"
import type { ContactDetails, HoursRow } from "@/lib/view-models"

export interface SiteChrome {
  chrome: LocationChrome
  locale: Locale
  paths: LocationPaths
  contact: ContactDetails
  hours: HoursRow[]
  isOpen: boolean
  /** "פתוח עכשיו · עד 19:00", or undefined when no hours are configured. */
  statusLabel?: string
}

/**
 * Resolve a location slug into everything the site chrome needs, localized and
 * pre-formatted.
 *
 * Layout and pages both need this, and computing it once here keeps the
 * components free of `Localized` values, timezones and href building.
 */
export async function loadSiteChrome(slug: string): Promise<SiteChrome> {
  const chrome = await getLocationChrome(slug)
  if (!chrome) notFound()

  const locale = (await getLocale()) as Locale
  const t = await getTranslations()

  const address = pickLocale(chrome.contact?.address, locale)
  const contact: ContactDetails = {
    phone: chrome.contact?.phone ?? "",
    email: chrome.contact?.email ?? "",
    address,
    whatsappHref: whatsappLink(chrome.contact?.whatsapp ?? ""),
    wazeHref: wazeLink(address),
    telHref: telLink(chrome.contact?.phone ?? ""),
    mailHref: mailLink(chrome.contact?.email ?? ""),
    instagramUrl: chrome.contact?.instagramUrl ?? undefined,
    facebookUrl: chrome.contact?.facebookUrl ?? undefined,
    tiktokUrl: chrome.contact?.tiktokUrl ?? undefined,
  }

  const names = {
    short: t.raw("weekdays.short") as string[],
    long: t.raw("weekdays.long") as string[],
  }

  const hours: HoursRow[] = summarizeHours(chrome.openingHours).map((row) => ({
    days: formatWeekdayRange(row, names),
    time: row.isClosed ? t("hours.closed") : `${row.opensAt}–${row.closesAt}`,
  }))

  const openState = getOpenState(chrome.openingHours)
  const statusLabel = openState
    ? openState.isOpen
      ? t("status.open", { time: openState.time })
      : openState.nextWeekday === undefined
        ? undefined
        : t("status.closedOnDay", {
            day: names.long[openState.nextWeekday],
            time: openState.time,
          })
    : undefined

  return {
    chrome,
    locale,
    paths: locationPaths(chrome.slug),
    contact,
    hours,
    isOpen: openState?.isOpen ?? false,
    statusLabel,
  }
}
