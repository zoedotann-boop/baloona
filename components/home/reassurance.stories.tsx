import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Reassurance } from "./reassurance"

const meta = {
  title: "Home/Reassurance",
  component: Reassurance,
  parameters: { layout: "fullscreen", backgrounds: { value: "nearwhite" } },
} satisfies Meta<typeof Reassurance>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
