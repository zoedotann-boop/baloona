import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Container } from "./container"

const meta = {
  title: "Layout/Container",
  component: Container,
  parameters: { layout: "fullscreen" },
  args: {
    className: "bg-brand-lavender-soft py-6 text-center text-brand-plum",
    children: "מכל תוכן ממורכז ברוחב האתר",
  },
} satisfies Meta<typeof Container>

export default meta
type Story = StoryObj<typeof meta>

export const Large: Story = { args: { size: "lg" } }
export const Medium: Story = { args: { size: "md" } }
export const Small: Story = { args: { size: "sm" } }
