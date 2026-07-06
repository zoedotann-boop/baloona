import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { IconTile } from "./icon-tile"

const meta = {
  title: "Brand/IconTile",
  component: IconTile,
  parameters: { backgrounds: { value: "white" } },
  argTypes: {
    tone: {
      control: "inline-radio",
      options: ["pink", "sky", "cream", "coral", "soft"],
    },
    size: { control: "inline-radio", options: ["sm", "md"] },
  },
  args: { icon: "cake", tone: "pink", size: "md" },
} satisfies Meta<typeof IconTile>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Tones: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <IconTile icon="building" tone="pink" />
      <IconTile icon="utensils" tone="sky" />
      <IconTile icon="cake" tone="cream" />
      <IconTile icon="gift" tone="coral" />
      <IconTile icon="star" tone="soft" />
    </div>
  ),
}
