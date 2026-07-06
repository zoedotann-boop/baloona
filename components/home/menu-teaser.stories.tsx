import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { MenuTeaser } from "./menu-teaser"

const meta = {
  title: "Home/MenuTeaser",
  component: MenuTeaser,
  parameters: { layout: "fullscreen", backgrounds: { value: "cream" } },
} satisfies Meta<typeof MenuTeaser>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
