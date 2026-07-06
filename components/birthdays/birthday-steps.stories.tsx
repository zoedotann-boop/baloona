import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { BirthdaySteps } from "./birthday-steps"

const meta = {
  title: "Birthdays/BirthdaySteps",
  component: BirthdaySteps,
  parameters: { layout: "fullscreen", backgrounds: { value: "cream" } },
} satisfies Meta<typeof BirthdaySteps>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
