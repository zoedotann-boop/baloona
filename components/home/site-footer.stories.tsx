import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { storyContact, storyHours, storyPaths } from "@/lib/story-fixtures"

import { SiteFooter } from "./site-footer"

const meta = {
  title: "Home/SiteFooter",
  component: SiteFooter,
  parameters: { layout: "fullscreen" },
  args: {
    paths: storyPaths,
    tagline: "מתחם ג׳ימבורי ויום הולדת לילדים בגילאי 1–9 בקרית אונו.",
    contact: storyContact,
    hours: storyHours,
    year: 2026,
  },
} satisfies Meta<typeof SiteFooter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
