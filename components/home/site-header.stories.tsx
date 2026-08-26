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
  },
} satisfies Meta<typeof SiteHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Brand-global variant: wordmark only, no branch nav. */
export const BrandGlobal: Story = {
  args: {
    paths: undefined,
    whatsappHref: undefined,
  },
}
