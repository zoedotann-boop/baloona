import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { AccentSquare } from "./accent-square"

const meta = {
  title: "Brand/AccentSquare",
  component: AccentSquare,
  parameters: { backgrounds: { value: "nearwhite" } },
  args: { color: "bg-brand-lavender", size: 96, rotate: 0 },
} satisfies Meta<typeof AccentSquare>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// Peeking behind a card corner — the real usage.
export const BehindCard: Story = {
  render: () => (
    <div className="relative inline-block">
      <AccentSquare
        className="absolute -end-5 -top-4 -z-10"
        color="bg-brand-banana"
      />
      <AccentSquare
        className="absolute -start-4 -bottom-5 -z-10"
        color="bg-brand-mint"
        rotate={8}
      />
      <div className="relative w-64 rounded-[26px] border border-border bg-white p-6 text-brand-plum">
        כרטיס עם ריבועי אקסנט
      </div>
    </div>
  ),
}
