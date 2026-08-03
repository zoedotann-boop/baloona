import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Panel } from "./panel"

const meta = {
  title: "Brand/Panel",
  component: Panel,
  parameters: { backgrounds: { value: "nearwhite" } },
  argTypes: {
    tone: {
      control: "inline-radio",
      options: ["lavender", "mint", "banana", "pink", "white"],
    },
  },
  args: { tone: "lavender" },
  render: (args) => (
    <div className="w-[420px]">
      <Panel {...args}>
        <div className="font-heading text-[26px] font-black">כותרת פאנל</div>
        <p className="mt-3 leading-[1.9]">
          טקסט זורם בתוך פאנל מעוגל — המשטח המרכזי של העיצוב.
        </p>
      </Panel>
    </div>
  ),
} satisfies Meta<typeof Panel>

export default meta
type Story = StoryObj<typeof meta>

export const Lavender: Story = {}
export const Mint: Story = { args: { tone: "mint" } }
export const Banana: Story = { args: { tone: "banana" } }
export const Pink: Story = { args: { tone: "pink" } }
export const White: Story = { args: { tone: "white" } }
