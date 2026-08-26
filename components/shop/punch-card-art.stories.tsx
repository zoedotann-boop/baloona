import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { PunchCardArt } from "./punch-card-art"

const meta = {
  title: "Shop/PunchCardArt",
  component: PunchCardArt,
  args: {
    theme: "age12",
    caption: "כרטיסיית כניסה לילדים עד גיל 12",
  },
  parameters: { backgrounds: { value: "nearwhite" } },
  decorators: [
    (Story) => (
      <div dir="rtl" className="max-w-[260px] pt-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PunchCardArt>

export default meta
type Story = StoryObj<typeof meta>

/** The pink flamingo "up to age 12" card. */
export const Age12: Story = {}

/** The blue hot-air-balloon "up to age 2" card. */
export const Age2: Story = {
  args: {
    theme: "age2",
    caption: "כרטיסיית כניסה לילדים עד גיל שנתיים",
  },
}

/** A customer's own card mid-way through: four of the ten slots stamped. */
export const Punched: Story = { args: { used: 4 } }

/** A fully redeemed card — every slot stamped. */
export const Full: Story = { args: { used: 10 } }
