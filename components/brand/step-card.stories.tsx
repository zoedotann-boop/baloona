import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { StepCard } from "./step-card"

const meta = {
  title: "Brand/StepCard",
  component: StepCard,
  parameters: { backgrounds: { value: "cream" } },
  args: {
    index: 1,
    image: "/assets/birthday-steps/facilities.png",
    title: "גישה חופשית למתקנים",
    sub: "שעתיים של כיף + חדר פרטי",
  },
  render: (args) => (
    <div className="w-[280px] pt-4">
      <StepCard {...args} />
    </div>
  ),
} satisfies Meta<typeof StepCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
