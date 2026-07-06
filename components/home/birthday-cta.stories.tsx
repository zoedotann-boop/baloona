import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { BirthdayCta } from "./birthday-cta"

const meta = {
  title: "Home/BirthdayCta",
  component: BirthdayCta,
  parameters: { layout: "fullscreen", backgrounds: { value: "white" } },
} satisfies Meta<typeof BirthdayCta>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
