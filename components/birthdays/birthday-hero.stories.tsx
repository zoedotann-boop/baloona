import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { BirthdayHero } from "./birthday-hero"

const meta = {
  title: "Birthdays/BirthdayHero",
  component: BirthdayHero,
  parameters: { layout: "fullscreen", backgrounds: { value: "pink" } },
} satisfies Meta<typeof BirthdayHero>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
