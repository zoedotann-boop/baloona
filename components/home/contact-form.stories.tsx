import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { ContactForm } from "./contact-form"

const meta = {
  title: "Home/ContactForm",
  component: ContactForm,
  parameters: { backgrounds: { value: "pink" } },
  render: () => (
    <div className="w-[440px]">
      <ContactForm />
    </div>
  ),
} satisfies Meta<typeof ContactForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
