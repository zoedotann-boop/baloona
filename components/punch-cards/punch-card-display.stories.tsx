import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { PunchCardDisplay } from "./punch-card-display"

const meta = {
  title: "PunchCards/PunchCardDisplay",
  component: PunchCardDisplay,
  args: { total: 10, used: 4 },
  parameters: { backgrounds: { value: "lavender" } },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PunchCardDisplay>

export default meta
type Story = StoryObj<typeof meta>

export const Fresh: Story = { args: { used: 0 } }

export const Partial: Story = {
  args: { used: 4, customerName: "מיכל", branchName: "באלונה תל אביב" },
}

export const AlmostFull: Story = { args: { used: 9 } }

export const Completed: Story = { args: { used: 10 } }

export const SmallCard: Story = { args: { total: 6, used: 2 } }
