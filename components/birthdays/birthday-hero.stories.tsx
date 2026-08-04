import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { BirthdayHero } from "./birthday-hero"

const meta = {
  title: "Birthdays/BirthdayHero",
  component: BirthdayHero,
  parameters: { layout: "fullscreen" },
  args: {
    title: "חוגגים יום הולדת בבלונה!",
    description:
      "שעתיים של כיף עם גישה חופשית למתקנים, חדר פרטי, פיצה לכל ילד וטקס עוגה ע״י צוות המקום.",
    imageUrl: "/assets/birthday-hero.png",
  },
} satisfies Meta<typeof BirthdayHero>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
