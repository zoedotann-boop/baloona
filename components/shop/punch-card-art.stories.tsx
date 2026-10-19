import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { PunchCardArt } from "./punch-card-art"

const meta = {
  title: "Shop/PunchCardArt",
  component: PunchCardArt,
  args: {
    theme: "age12",
    caption: "כרטיסיית כניסה לילדים עד גיל 12",
    total: 10,
  },
  parameters: { backgrounds: { value: "nearwhite" } },
  decorators: [
    (Story) => (
      <div dir="rtl" className="w-[260px] pt-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PunchCardArt>

export default meta
type Story = StoryObj<typeof meta>

export const Age12: Story = {}

export const Age2: Story = {
  args: {
    theme: "age2",
    caption: "כרטיסיית כניסה לילדים עד גיל שנתיים",
  },
}

export const Punched: Story = { args: { used: 4 } }

export const Full: Story = { args: { used: 10 } }

export const SinglePunch: Story = { args: { total: 1 } }

export const SingleColumn: Story = { args: { total: 4, used: 1 } }

export const UnevenColumns: Story = { args: { total: 7, used: 5 } }

export const UnevenColumnsAge2: Story = {
  args: {
    theme: "age2",
    caption: "כרטיסיית כניסה לילדים עד גיל שנתיים",
    total: 7,
    used: 2,
  },
}

export const MoreThanTen: Story = { args: { total: 24, used: 3 } }

const COUNTS = Array.from({ length: 10 }, (_, index) => index + 1)

export const EveryCount: Story = {
  decorators: [
    (Story) => (
      <div dir="rtl" className="flex flex-wrap items-end gap-4 p-4">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <>
      {COUNTS.map((total) => (
        <div key={total} className="w-[200px]">
          <PunchCardArt {...args} total={total} used={Math.floor(total / 2)} />
        </div>
      ))}
    </>
  ),
}
