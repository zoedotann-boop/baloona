import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { FEATURE_COLORS } from "@/lib/home-config"

import { BalloonClusterIcon } from "./balloon-cluster-icon"

const meta = {
  title: "Brand/BalloonClusterIcon",
  component: BalloonClusterIcon,
  parameters: { backgrounds: { value: "white" } },
  args: { size: 64, color: "var(--brand-coral)" },
} satisfies Meta<typeof BalloonClusterIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Palette: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      {FEATURE_COLORS.map((color) => (
        <BalloonClusterIcon key={color} color={color} size={56} />
      ))}
    </div>
  ),
}
