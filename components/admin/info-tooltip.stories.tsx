import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { AdminField, AdminInput } from "./admin-ui"
import { InfoTooltip } from "./info-tooltip"

const meta = {
  title: "Admin/InfoTooltip",
  component: InfoTooltip,
  parameters: { backgrounds: { value: "nearwhite" } },
  args: {
    text: "מספר וואטסאפ בפורמט בינלאומי ללא +, למשל 972501234567.",
  },
  decorators: [
    (Story) => (
      <div className="w-[420px] max-w-full pb-24">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InfoTooltip>

export default meta
type Story = StoryObj<typeof meta>

/** The bare icon — hover or focus it to reveal the guidance bubble. */
export const Default: Story = {}

/** How it reads in context: an info icon beside an admin field label. */
export const OnAField: Story = {
  render: (args) => (
    <AdminField label="וואטסאפ" tooltip={args.text}>
      <AdminInput
        dir="ltr"
        defaultValue="972501234567"
        className="text-start"
      />
    </AdminField>
  ),
}
