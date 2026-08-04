import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { storyLocationId, storySubjects } from "@/lib/story-fixtures"

import { ContactForm } from "./contact-form"

const meta = {
  title: "Home/ContactForm",
  component: ContactForm,
  parameters: { backgrounds: { value: "lavender" } },
  args: { locationId: storyLocationId, subjects: storySubjects },
  decorators: [
    (Story) => (
      <div className="w-[420px] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ContactForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
