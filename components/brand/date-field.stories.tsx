import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { useState } from "react"

import { DateField } from "./date-field"

function DateFieldDemo(args: React.ComponentProps<typeof DateField>) {
  const [value, setValue] = useState<string | undefined>(args.value)
  return (
    <div className="w-[320px]">
      <DateField {...args} value={value} onChange={setValue} />
    </div>
  )
}

const meta = {
  title: "Brand/DateField",
  component: DateField,
  parameters: { backgrounds: { value: "nearwhite" } },
  args: {
    placeholder: "בחרו תאריך",
    disabledDaysOfWeek: [6],
  },
  render: (args) => <DateFieldDemo {...args} />,
} satisfies Meta<typeof DateField>

export default meta
type Story = StoryObj<typeof meta>

export const SaturdaysDisabled: Story = {}

export const AllDaysSelectable: Story = {
  args: { disabledDaysOfWeek: undefined },
}
