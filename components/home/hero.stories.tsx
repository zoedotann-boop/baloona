import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { storyContact, storyHours } from "@/lib/story-fixtures"

import { Hero } from "./hero"

const meta = {
  title: "Home/Hero",
  component: Hero,
  parameters: { layout: "fullscreen" },
  args: {
    badge: "פתוח עכשיו · עד 19:00",
    title: "משחקייה ובית קפה — להורים ולילדים",
    description:
      "מתחם ג׳ימבורי ענק של 3 קומות לילדים בגילאי 1–9. לשבת עם הקטנים וליהנות גם אנחנו.",
    images: [
      "/assets/gallery/gallery-1.png",
      "/assets/gallery/gallery-2.png",
      "/assets/gallery/gallery-3.png",
    ],
    wazeHref: storyContact.wazeHref,
    whatsappHref: storyContact.whatsappHref,
    hours: storyHours,
    isOpen: true,
  },
} satisfies Meta<typeof Hero>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Closed: Story = { args: { isOpen: false } }
