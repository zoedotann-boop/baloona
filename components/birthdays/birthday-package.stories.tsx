import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { BirthdayPackage } from "./birthday-package"

const meta = {
  title: "Birthdays/BirthdayPackage",
  component: BirthdayPackage,
  parameters: { layout: "fullscreen", backgrounds: { value: "pink" } },
} satisfies Meta<typeof BirthdayPackage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
