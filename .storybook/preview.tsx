import type { Preview } from "@storybook/nextjs-vite"
import { NextIntlClientProvider } from "next-intl"
import type { CSSProperties } from "react"

import messages from "../messages/he.json"
import "../app/globals.css"

// Fonts are loaded via Google Fonts in preview-head.html; map them onto the
// CSS variables the design tokens expect.
const fontVars: CSSProperties = {
  "--font-sans": "'Heebo', sans-serif",
  "--font-heading": "'Rubik', sans-serif",
} as CSSProperties

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    backgrounds: {
      default: "cream",
      options: {
        cream: { name: "Cream", value: "#fffaed" },
        pink: { name: "Pink", value: "#fbdde0" },
        white: { name: "White", value: "#ffffff" },
        blue: { name: "Blue", value: "#bfe0ee" },
      },
    },
    a11y: { test: "todo" },
  },
  initialGlobals: {
    backgrounds: { value: "cream" },
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
