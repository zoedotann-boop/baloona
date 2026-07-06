import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { MenuItemCard } from "./menu-item-card"

const meta = {
  title: "Brand/MenuItemCard",
  component: MenuItemCard,
  parameters: { backgrounds: { value: "pink" } },
  args: {
    name: "פיצה אישית",
    price: "32 ₪",
    desc: "רוטב עגבניות + מוצרלה",
  },
  render: (args) => (
    <div className="w-[320px]">
      <MenuItemCard {...args} />
    </div>
  ),
} satisfies Meta<typeof MenuItemCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const NoDescription: Story = {
  args: { name: "נקניקיה בלחמניה", price: "15 ₪", desc: undefined },
}
