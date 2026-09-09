import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { PunchCardDisplay } from "./punch-card-display"

const meta = {
  title: "PunchCards/PunchCardDisplay",
  component: PunchCardDisplay,
  args: { total: 10, used: 4 },
  parameters: { backgrounds: { value: "lavender" } },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PunchCardDisplay>

export default meta
type Story = StoryObj<typeof meta>

export const Fresh: Story = { args: { used: 0 } }

export const Partial: Story = {
  args: {
    used: 4,
    customerName: "מיכל",
    branchName: "באלונה תל אביב",
    punches: [
      { id: "1", at: "1.9.2026, 10:24", branch: "באלונה תל אביב" },
      { id: "2", at: "8.9.2026, 16:05", branch: "באלונה תל אביב" },
      { id: "3", at: "15.9.2026, 11:47", branch: "באלונה הרצליה" },
      { id: "4", at: "22.9.2026, 17:32", branch: "באלונה הרצליה" },
    ],
  },
}

export const UnderTwo: Story = {
  args: {
    theme: "age2",
    used: 4,
    customerName: "נועה",
    branchName: "באלונה תל אביב",
  },
}

export const AlmostFull: Story = { args: { used: 9 } }

export const Completed: Story = { args: { used: 10 } }
