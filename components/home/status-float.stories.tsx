import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { StatusFloat } from "./status-float"

const meta = {
  title: "Home/StatusFloat",
  component: StatusFloat,
  parameters: { layout: "fullscreen" },
  argTypes: { isOpen: { control: "boolean" } },
  args: {
    label: "פתוח עכשיו · עד 19:00",
    isOpen: true,
  },
} satisfies Meta<typeof StatusFloat>

export default meta
type Story = StoryObj<typeof meta>

export const Open: Story = {}

/** Closed — the pill turns red. */
export const Closed: Story = {
  args: { isOpen: false, label: "סגור · נפתח ביום חמישי ב-09:00" },
}
