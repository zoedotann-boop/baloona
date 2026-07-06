import { Rubik, Heebo } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getLocale } from "next-intl/server"

import "./globals.css"
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

  return (
    <html
      lang={locale}
      dir="rtl"
      suppressHydrationWarning
      className={cn("antialiased", heebo.variable, rubik.variable)}
    >
      <body>
        <NextIntlClientProvider>
          {/* The Cloud & Candy design is light-only; force light so token-based
              text never inverts to white-on-white in dark environments. */}
          <ThemeProvider forcedTheme="light">{children}</ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
