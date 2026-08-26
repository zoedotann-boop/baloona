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
    showBranchSwitch: true,
    year: 2026,
  },
} satisfies Meta<typeof SiteFooter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Slim brand-global variant shown on pages with no branch behind them. */
export const BrandGlobal: Story = {
  args: {
    paths: undefined,
    tagline: undefined,
    contact: undefined,
    hours: undefined,
  },
}
