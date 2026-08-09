import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { ProductCard } from "./product-card"

const meta = {
  title: "Shop/ProductCard",
  component: ProductCard,
  args: {
    name: "כרטיסייה 10 כניסות",
    entries: 10,
    entriesLabel: "10 כניסות",
    perEntryLabel: "רק 35 ₪ לכניסה!",
    price: "350 ₪",
    featured: false,
    popularLabel: "הבחירה הפופולרית",
    buyLabel: "לרכישה",
    href: "#",
  },
  parameters: { backgrounds: { value: "nearwhite" } },
  decorators: [
    (Story) => (
      <div className="max-w-xs pt-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProductCard>

export default meta
type Story = StoryObj<typeof meta>

export const TenEntries: Story = {}

export const Featured: Story = { args: { featured: true } }

export const TwentyEntries: Story = {
  args: {
    name: "כרטיסייה 20 כניסות",
    entries: 20,
    entriesLabel: "20 כניסות",
    perEntryLabel: "רק 32.5 ₪ לכניסה!",
    price: "650 ₪",
  },
}

export const FiveEntries: Story = {
  args: {
    name: "כרטיסייה 5 כניסות",
    entries: 5,
    entriesLabel: "5 כניסות",
    perEntryLabel: "רק 40 ₪ לכניסה!",
    price: "200 ₪",
  },
}
