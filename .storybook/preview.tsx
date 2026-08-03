import type { Preview } from "@storybook/nextjs-vite"
import { NextIntlClientProvider } from "next-intl"
import type { CSSProperties } from "react"

import messages from "../messages/he.json"
import "../app/globals.css"

// Fonts are loaded via Google Fonts in preview-head.html; map them onto the
// CSS variables the design tokens expect.
const fontVars: CSSProperties = {
  "--font-sans": "'Assistant', sans-serif",
  "--font-heading": "'Fredoka', sans-serif",
} as CSSProperties

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    backgrounds: {
      default: "nearwhite",
      options: {
        lavender: { name: "Lavender", value: "#ebe3f5" },
        pink: { name: "Pink", value: "#fbd3e0" },
        banana: { name: "Banana", value: "#fde293" },
        nearwhite: { name: "Near-white", value: "#fdf6f8" },
      },
    },
    a11y: { test: "todo" },
  },
  initialGlobals: {
    backgrounds: { value: "nearwhite" },
  },
  decorators: [
    (Story) => (
      // Every story renders RTL with the Baloona fonts + design tokens applied.
      <NextIntlClientProvider
        locale="he"
        messages={messages}
        timeZone="Asia/Jerusalem"
      >
        <div dir="rtl" className="font-sans text-foreground" style={fontVars}>
          <Story />
        </div>
      </NextIntlClientProvider>
    ),
  ],
}

export default preview
