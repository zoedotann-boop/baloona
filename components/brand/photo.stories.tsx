import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Photo } from "./photo"

const meta = {
  title: "Brand/Photo",
  component: Photo,
  parameters: { backgrounds: { value: "white" } },
  args: { label: "[תמונת מתחם בלונה]" },
  render: (args) => (
    <div className="w-[420px]">
      <Photo {...args} className="h-64" />
    </div>
  ),
} satisfies Meta<typeof Photo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const NoLabel: Story = { args: { label: undefined } }
