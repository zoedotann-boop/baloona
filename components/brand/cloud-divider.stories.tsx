import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { CloudDivider } from "./cloud-divider"

const meta = {
  title: "Brand/CloudDivider",
  component: CloudDivider,
  parameters: { layout: "fullscreen" },
  argTypes: { size: { control: "inline-radio", options: ["sm", "md"] } },
  args: { size: "md" },
  decorators: [
    (Story) => (
      <div className="w-full">
        <div className="h-16 bg-brand-pink" />
        <Story />
        <div className="h-16 bg-white" />
      </div>
    ),
  ],
} satisfies Meta<typeof CloudDivider>

export default meta
type Story = StoryObj<typeof meta>

export const Medium: Story = {}

export const Small: Story = { args: { size: "sm" } }
