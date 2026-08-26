import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { ProductCard } from "./product-card"

const meta = {
  title: "Shop/ProductCard",
  component: ProductCard,
  args: {
    name: "כרטיסייה 10 כניסות",
    perEntryLabel: "רק 35 ₪ לכניסה!",
    price: "350 ₪",
    featured: false,
    popularLabel: "הבחירה הפופולרית",
    buyLabel: "לרכישה",
    theme: "age12",
    cardCaption: "כרטיסיית כניסה לילדים עד גיל 12",
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

/** The "up to age 12" pink flamingo card. */
export const Age12: Story = {}

/** The "up to age 2" blue balloons card. */
export const Age2: Story = {
  args: {
    name: "כרטיסייה 5 כניסות",
    price: "200 ₪",
    theme: "age2",
    cardCaption: "כרטיסיית כניסה לילדים עד גיל שנתיים",
  },
}

export const Featured: Story = { args: { featured: true } }
