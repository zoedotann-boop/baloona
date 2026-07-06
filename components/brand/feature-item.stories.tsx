import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { FEATURE_COLORS } from "@/lib/home-config"

import { FeatureItem } from "./feature-item"

const meta = {
  title: "Brand/FeatureItem",
  component: FeatureItem,
  parameters: { backgrounds: { value: "white" } },
  args: {
    title: "מתחם 3 קומות",
    description: "אזורי משחק לכל הגילאים",
    color: FEATURE_COLORS[0],
  },
} satisfies Meta<typeof FeatureItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Grid: Story = {
  render: () => (
    <div className="grid max-w-3xl grid-cols-2 gap-6">
      <FeatureItem
        title="מתחם 3 קומות"
        description="אזורי משחק לכל הגילאים"
        color={FEATURE_COLORS[0]}
      />
      <FeatureItem
        title="מזנון ביתי"
        description="אוכל חם, קפה ומתוקים"
        color={FEATURE_COLORS[1]}
      />
      <FeatureItem
        title="חדר יום הולדת"
        description="חדר פרטי לחגיגות"
        color={FEATURE_COLORS[2]}
      />
      <FeatureItem
        title="ממוזג וממוגן"
        description="בטיחות מקסימלית"
        color={FEATURE_COLORS[3]}
      />
    </div>
  ),
}
