import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { storyContact, storyPaths } from "@/lib/story-fixtures"

import { SiteHeader } from "./site-header"

const meta = {
  title: "Home/SiteHeader",
  component: SiteHeader,
  parameters: { layout: "fullscreen" },
  args: {
    paths: storyPaths,
    whatsappHref: storyContact.whatsappHref,
    statusLabel: "פתוח עכשיו · עד 19:00",
    showBranchSwitch: true,
  },
} satisfies Meta<typeof SiteHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SingleBranch: Story = {
  args: { showBranchSwitch: false, statusLabel: undefined },
}

/** Brand-global variant: wordmark + language switcher only, no branch nav. */
export const BrandGlobal: Story = {
  args: {
    paths: undefined,
    whatsappHref: undefined,
    statusLabel: undefined,
    showBranchSwitch: false,
  },
}
