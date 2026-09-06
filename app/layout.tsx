import type { Metadata } from "next"
import { Assistant, Fredoka } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getLocale } from "next-intl/server"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

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
          <ThemeProvider forcedTheme="light">{children}</ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
