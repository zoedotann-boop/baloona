import { Assistant, Fredoka } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getLocale } from "next-intl/server"

import "./globals.css"
import { AnnouncementModal } from "@/components/brand/announcement-modal"
import { ContactSection } from "@/components/home/contact-section"
import { SiteFooter } from "@/components/home/site-footer"
import { SiteHeader } from "@/components/home/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

// Baloona design language — Assistant for body copy, Fredoka (rounded, playful)
// for display/headings and the wordmark. Both ship Hebrew subsets; the site is
// RTL. Fredoka's weight axis maxes at 700, so font-black/extrabold headings
// clamp to 700 (no layout shift).
const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  display: "swap",
  variable: "--font-sans",
})

const fredoka = Fredoka({
  subsets: ["hebrew", "latin"],
  display: "swap",
  variable: "--font-heading",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const dir = locale === "he" ? "rtl" : "ltr"

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={cn("antialiased", assistant.variable, fredoka.variable)}
    >
      <body>
        <NextIntlClientProvider>
          {/* The Pastel Wonderland design is light-only; force light so
              token-based text never inverts to white-on-white in dark
              environments. */}
          <ThemeProvider forcedTheme="light">
            <div className="flex min-h-svh flex-col bg-background">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              {/* Contact appears on every page, just above the footer. */}
              <ContactSection />
              <SiteFooter />
            </div>
            <AnnouncementModal />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
