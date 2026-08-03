import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { SignaturePad } from "./signature-pad"

const meta = {
  title: "Brand/SignaturePad",
  component: SignaturePad,
  parameters: { backgrounds: { value: "nearwhite" } },
  args: { hint: "חתמו כאן עם העכבר או האצבע", clearLabel: "ניקוי חתימה" },
  render: (args) => (
    <div className="w-[360px]">
      <SignaturePad {...args} />
    </div>
  ),
} satisfies Meta<typeof SignaturePad>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
