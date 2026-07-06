import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { PriceCard } from "./price-card"

const rows = [
  { label: "עד גיל שנתיים", price: "39 ₪" },
  { label: "מעל גיל שנתיים", price: "49 ₪" },
]

const meta = {
  title: "Brand/PriceCard",
  component: PriceCard,
  parameters: { backgrounds: { value: "white" } },
  args: {
    sub: "אמצע השבוע",
    title: "א׳–ה׳",
    rows,
    featured: false,
    popularLabel: "הכי פופולרי",
  },
  render: (args) => (
    <div className="w-[320px]">
      <PriceCard {...args} />
    </div>
  ),
} satisfies Meta<typeof PriceCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Featured: Story = {
  args: {
    sub: "סוף שבוע",
    title: "שישי–שבת",
    featured: true,
    rows: [
      { label: "עד גיל שנתיים", price: "45 ₪" },
      { label: "מעל גיל שנתיים", price: "55 ₪" },
    ],
  },
}

export const LightTone: Story = {
  args: { tone: "light" },
}
