import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { FEATURE_COLORS } from "@/lib/view-models"

import { FeatureItem } from "./feature-item"

const meta = {
  title: "Brand/FeatureItem",
  component: FeatureItem,
  parameters: { backgrounds: { value: "nearwhite" } },
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
        title="אזור משחקים מזמין"
        description="מרחב אסתטי ונעים לילדים"
        color={FEATURE_COLORS[0]}
      />
      <FeatureItem
        title="בית קפה להורים"
        description="קפה, מתוקים וכיבוד"
        color={FEATURE_COLORS[1]}
      />
      <FeatureItem
        title="חוגים וימי הולדת"
        description="סדנאות, הרצאות וחגיגות"
        color={FEATURE_COLORS[2]}
      />
    </div>
  ),
}
