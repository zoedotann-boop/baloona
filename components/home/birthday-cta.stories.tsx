import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { storyPaths } from "@/lib/story-fixtures"

import { BirthdayCta } from "./birthday-cta"

const meta = {
  title: "Home/BirthdayCta",
  component: BirthdayCta,
  parameters: { layout: "fullscreen" },
  args: {
    title: "חוגגים יום הולדת בבלונה!",
    description:
      "שעתיים של כיף עם גישה חופשית למתקנים, חדר פרטי, פיצה לכל ילד וטקס עוגה.",
    ctaLabel: "לכל הפרטים",
    ctaHref: storyPaths.birthdays,
    imageUrl: "/birthday.png",
  },
} satisfies Meta<typeof BirthdayCta>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithoutPhoto: Story = { args: { imageUrl: undefined } }
