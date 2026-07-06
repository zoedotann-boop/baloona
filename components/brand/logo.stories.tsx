import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Logo } from "./logo"

const meta = {
  title: "Brand/Logo",
  component: Logo,
  parameters: { backgrounds: { value: "white" } },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg", "hero"] },
  },
  args: { size: "md", label: "Baloona" },
} satisfies Meta<typeof Logo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <Logo size="sm" />
      <Logo size="md" />
      <Logo size="lg" />
    </div>
  ),
}

export const Hero: Story = {
  args: { size: "hero" },
  parameters: { layout: "fullscreen", backgrounds: { value: "pink" } },
}
