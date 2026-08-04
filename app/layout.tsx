import type { Metadata } from "next"
import { Assistant, Fredoka } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getLocale } from "next-intl/server"

import "./globals.css"
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

export const metadata: Metadata = {
  title: "Baloona",
}

/**
 * Root shell only: fonts, locale and theme. Site chrome (header, contact block,
 * footer) lives in `app/[location]/layout.tsx` because it is bound to a venue,
 * and the admin renders its own shell.
 */
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
          <ThemeProvider forcedTheme="light">{children}</ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
