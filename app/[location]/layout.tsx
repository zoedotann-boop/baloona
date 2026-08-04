import { TrackingScripts } from "@/components/analytics/tracking-scripts"
import { AnnouncementModal } from "@/components/brand/announcement-modal"
import { ContactSection } from "@/components/home/contact-section"
import { SiteFooter } from "@/components/home/site-footer"
import { SiteHeader } from "@/components/home/site-header"
import { listPublishedLocations } from "@/lib/db/queries/site"
import { pickLocale, pickLocaleList } from "@/lib/localized"
import { loadSiteChrome } from "@/lib/site-view"

/**
 * Chrome for one branch: header, page content, contact block and footer.
 *
 * Pages render per request — the locale cookie already makes them dynamic, and
 * reading Neon directly means an admin edit is live immediately with no cache
 * to invalidate.
 */
export default async function LocationLayout({
  params,
  children,
}: LayoutProps<"/[location]">) {
  const { location: slug } = await params
  const [{ chrome, locale, paths, contact, hours, statusLabel }, published] =
    await Promise.all([loadSiteChrome(slug), listPublishedLocations()])

  const announcement = chrome.announcement
  const settings = chrome.settings

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader
        paths={paths}
        whatsappHref={contact.whatsappHref}
        statusLabel={statusLabel}
        showBranchSwitch={published.length > 1}
      />
      <main className="flex-1">{children}</main>

      {/* Contact appears on every page, just above the footer. */}
      <ContactSection
        locationId={chrome.id}
        title={pickLocale(chrome.site?.contactTitle, locale)}
        eyebrow={pickLocale(chrome.site?.contactEyebrow, locale)}
        contact={contact}
        hours={hours}
        subjects={chrome.contactSubjects.map((subject) =>
          pickLocale(subject.label, locale)
        )}
      />

      <SiteFooter
        paths={paths}
        tagline={pickLocale(chrome.site?.footerTagline, locale)}
        contact={contact}
        hours={hours}
        year={new Date().getFullYear()}
      />

      {announcement?.isActive && (
        <AnnouncementModal
          storageKey={`baloona:announcement:${chrome.slug}:${announcement.version}`}
          title={pickLocale(announcement.title, locale)}
          body={pickLocale(announcement.body, locale) || undefined}
          lines={pickLocaleList(announcement.lines, locale)}
          ctaLabel={pickLocale(announcement.ctaLabel, locale) || undefined}
          ctaHref={announcement.ctaHref ?? undefined}
        />
      )}

      <TrackingScripts
        gaMeasurementId={settings?.gaMeasurementId}
        gtmContainerId={settings?.gtmContainerId}
        metaPixelId={settings?.metaPixelId}
      />
    </div>
  )
}
