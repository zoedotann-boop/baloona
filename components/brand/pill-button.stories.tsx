import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { PillButton } from "./pill-button"

const meta = {
  title: "Brand/PillButton",
  component: PillButton,
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["primary", "outline", "soft"],
    },
    size: { control: "inline-radio", options: ["md", "lg"] },
  },
  args: { children: "נווטו אלינו (Waze)", variant: "primary", size: "lg" },
} satisfies Meta<typeof PillButton>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const Outline: Story = {
  args: { variant: "outline", children: "וואטסאפ" },
  parameters: { backgrounds: { value: "pink" } },
}

export const Soft: Story = {
  args: { variant: "soft", children: "לכל הפרטים ←" },
  parameters: { backgrounds: { value: "blue" } },
}

export const AsLink: Story = {
  args: { href: "#", children: "קישור" },
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <PillButton variant="primary">ראשי</PillButton>
      <PillButton variant="outline">משני</PillButton>
      <PillButton variant="soft">רך</PillButton>
    </div>
  ),
}
