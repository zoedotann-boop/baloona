import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { storyContact } from "@/lib/story-fixtures"

import { Features } from "./features"

const meta = {
  title: "Home/Features",
  component: Features,
  parameters: { layout: "fullscreen" },
  args: {
    items: [
      {
        title: "אזור משחקים מזמין",
        description: "מרחב אסתטי ונעים לתינוקות, לפעוטות ולילדים",
      },
      {
        title: "בית קפה להורים",
        description: "קפה, מתוקים וכיבוד — לכם ולילדים, לאורך כל היום",
      },
      {
        title: "חוגים וימי הולדת",
        description: "חוגי התפתחות, סדנאות, הרצאות העשרה וחגיגות",
      },
    ],
    ctaLabel: "בואו להכיר את המתחם",
    ctaHref: storyContact.whatsappHref,
  },
} satisfies Meta<typeof Features>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
