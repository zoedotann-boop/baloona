import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { StatusBadge } from "./status-badge"

const meta = {
  title: "Brand/StatusBadge",
  component: StatusBadge,
  argTypes: {
    variant: { control: "inline-radio", options: ["pill", "inline"] },
    animated: { control: "boolean" },
  },
  args: { label: "פתוח עכשיו · עד 19:00", variant: "pill", animated: true },
} satisfies Meta<typeof StatusBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Pill: Story = {}

export const Inline: Story = {
  args: { variant: "inline" },
  parameters: { backgrounds: { value: "white" } },
}
