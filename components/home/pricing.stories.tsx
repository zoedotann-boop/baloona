import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { storyHours } from "@/lib/story-fixtures"

import { Pricing } from "./pricing"

const meta = {
  title: "Home/Pricing",
  component: Pricing,
  parameters: { layout: "fullscreen" },
  args: {
    title: "מחירון",
    tiers: [
      {
        id: "weekday",
        subtitle: "אמצע השבוע",
        title: "א׳–ה׳",
        rows: [
          { id: "a", label: "עד גיל שנתיים", price: "39 ₪" },
          { id: "b", label: "מעל גיל שנתיים", price: "49 ₪" },
        ],
      },
      {
        id: "weekend",
        subtitle: "סוף שבוע",
        title: "שישי–שבת",
        rows: [
          { id: "c", label: "עד גיל שנתיים", price: "45 ₪" },
          { id: "d", label: "מעל גיל שנתיים", price: "55 ₪" },
        ],
      },
    ],
    hours: storyHours,
    rules: [
      "הכניסה עבור ילד ומלווה; כל מלווה נוסף בתוספת 20 ₪.",
      "כניסה יומית — אפשר לצאת ולחזור באותו יום.",
    ],
    note: "* הכניסה עבור ילד ומלווה. כניסה יומית.",
  },
} satisfies Meta<typeof Pricing>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
