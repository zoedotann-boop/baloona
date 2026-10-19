import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { PunchCardPreview } from "./punch-card-preview"

const meta = {
  title: "Admin/PunchCardPreview",
  component: PunchCardPreview,
  args: { theme: "age12", total: 10, used: 0 },
  argTypes: {
    total: { control: { type: "range", min: 1, max: 12 } },
    used: { control: { type: "range", min: 0, max: 12 } },
  },
  parameters: { backgrounds: { value: "nearwhite" } },
} satisfies Meta<typeof PunchCardPreview>

export default meta
type Story = StoryObj<typeof meta>

export const TenPunches: Story = {}

export const FourPunches: Story = { args: { total: 4, used: 1 } }

export const SevenPunchesAge2: Story = {
  args: { theme: "age2", total: 7, used: 3 },
}
