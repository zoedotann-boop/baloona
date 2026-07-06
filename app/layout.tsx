import { Rubik, Heebo } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getLocale } from "next-intl/server"

import "./globals.css"
import { SiteFooter } from "@/components/home/site-footer"
import { SiteHeader } from "@/components/home/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

// Baloona design language — Heebo for body copy, Rubik for display/headings.
// Both ship Hebrew subsets; the site is RTL.
const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-sans",
})

const rubik = Rubik({
  subsets: ["hebrew", "latin"],
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
      className={cn("antialiased", heebo.variable, rubik.variable)}
    >
      <body>
        <NextIntlClientProvider>
          {/* The Cloud & Candy design is light-only; force light so token-based
              text never inverts to white-on-white in dark environments. */}
          <ThemeProvider forcedTheme="light">
            <div className="flex min-h-svh flex-col bg-background">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
