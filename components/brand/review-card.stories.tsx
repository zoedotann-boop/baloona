import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { ReviewCard } from "./review-card"

const meta = {
  title: "Brand/ReviewCard",
  component: ReviewCard,
  parameters: { backgrounds: { value: "blue" } },
  args: {
    text: "המקום מהמם, הילדים לא רצו לצאת! נקי, בטוח והצוות פשוט מקסים.",
    name: "מיכל ל.",
    initials: "מ",
    ago: "לפני שבוע",
    rating: 5,
  },
  render: (args) => (
    <div className="w-[340px]">
      <ReviewCard {...args} />
    </div>
  ),
} satisfies Meta<typeof ReviewCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
