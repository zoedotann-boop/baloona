import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { useState } from "react"

import { ConsentCheckbox } from "./consent-checkbox"

const meta = {
  title: "Brand/ConsentCheckbox",
  component: ConsentCheckbox,
  args: {
    checked: false,
    onChange: () => {},
    children: "קראתי ואני מאשר/ת את התקנון ומדיניות הביטול",
  },
  parameters: { backgrounds: { value: "nearwhite" } },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ConsentCheckbox>

export default meta
type Story = StoryObj<typeof meta>

export const Unchecked: Story = {}

export const Checked: Story = { args: { checked: true } }

function InteractiveConsent() {
  const [agreed, setAgreed] = useState(false)
  return (
    <ConsentCheckbox checked={agreed} onChange={setAgreed}>
      קראתי ואני מאשר/ת את{" "}
      <a href="#" className="font-bold text-primary underline">
        התקנון ומדיניות הביטול
      </a>
    </ConsentCheckbox>
  )
}

export const WithTermsLink: Story = { render: () => <InteractiveConsent /> }
