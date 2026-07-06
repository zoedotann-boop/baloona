import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { SectionEyebrow } from "./section-eyebrow"

const meta = {
  title: "Brand/SectionEyebrow",
  component: SectionEyebrow,
  parameters: { backgrounds: { value: "white" } },
  args: { children: "מחירון כניסה למתחם" },
} satisfies Meta<typeof SectionEyebrow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
