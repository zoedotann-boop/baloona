import { TrackingScripts } from "@/components/analytics/tracking-scripts"
import { AnnouncementModal } from "@/components/brand/announcement-modal"
import { ContactSection } from "@/components/home/contact-section"
import { SiteFooter } from "@/components/home/site-footer"
import { SiteHeader } from "@/components/home/site-header"
import { listPublishedLocations } from "@/lib/db/queries/site"
import { pickLocale, pickLocaleList } from "@/lib/localized"
import { loadSiteChrome } from "@/lib/site-view"

import { PublicShell } from "./public-shell"

/**
 * Full per-branch chrome around a page: header, contact block and footer, plus
 * the branch's announcement modal and analytics. Used by the location layout
 * for every branch page, and by checkout when it knows the source branch, so
 * the shell is identical wherever a venue is in context.
 *
 * Rendered per request — the locale cookie already makes pages dynamic, and
 * reading Neon directly means an admin edit is live immediately with no cache
 * to invalidate.
 */
export async function SiteChrome({
  slug,
  children,
}: {
  slug: string
  children: React.ReactNode
}) {
  const [
    { chrome, locale, paths, contact, hours, statusLabel, isOpen },
    published,
  ] = await Promise.all([loadSiteChrome(slug), listPublishedLocations()])

  const announcement = chrome.announcement
  const settings = chrome.settings

  return (
    <>
      <PublicShell
        header={
          <SiteHeader
            paths={paths}
            whatsappHref={contact.whatsappHref}
            statusLabel={statusLabel}
            isOpen={isOpen}
            showBranchSwitch={published.length > 1}
          />
        }
        footer={
          <>
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
          </>
        }
      >
        {children}
      </PublicShell>

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
    </>
  )
}
