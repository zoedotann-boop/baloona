import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { BirthdayLeadForm } from "./birthday-lead-form"

const meta = {
  title: "Birthdays/BirthdayLeadForm",
  component: BirthdayLeadForm,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof BirthdayLeadForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
