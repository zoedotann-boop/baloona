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
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
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
  parameters: { backgrounds: { value: "lavender" } },
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

/** `sm` is the admin's scale — it lines up with the h-9 controls beside it. */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <PillButton size="sm">פרסום שינויים</PillButton>
      <PillButton size="md">הזמינו תאריך</PillButton>
      <PillButton size="lg">נווטו אלינו</PillButton>
    </div>
  ),
}
