import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { BirthdayScene } from "./birthday-scene"

const meta = {
  title: "Brand/BirthdayScene",
  component: BirthdayScene,
  parameters: { backgrounds: { value: "blue" } },
  render: () => (
    <div className="w-[420px] rounded-[32px] bg-brand-sky p-8">
      <BirthdayScene className="h-[280px]" />
    </div>
  ),
} satisfies Meta<typeof BirthdayScene>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
