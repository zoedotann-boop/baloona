import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { ShopSection } from "./shop-section"

const meta = {
  title: "Home/ShopSection",
  component: ShopSection,
  args: {
    title: "הכרטיסיות של בלונה",
    subtitle: "רכשו כרטיסייה דיגיטלית ותיהנו מכניסות במחיר משתלם.",
    note: "תקף בכל הסניפים",
    popularLabel: "הבחירה הפופולרית",
    buyLabel: "לרכישה",
    benefits: [
      "נשמר בנייד — אין יותר כרטיסיות שהולכות לאיבוד",
      "תקף לכל המשפחה — גם לאחים ולאחיות",
      "עדכון יתרה אוטומטי אחרי כל ביקור",
    ],
    products: [
      {
        id: "1",
        name: "כרטיסייה 5 כניסות",
        entries: 5,
        entriesLabel: "5 כניסות",
        perEntryLabel: "רק 40 ₪ לכניסה!",
        price: "200 ₪",
        featured: false,
        href: "#",
      },
      {
        id: "2",
        name: "כרטיסייה 10 כניסות",
        entries: 10,
        entriesLabel: "10 כניסות",
        perEntryLabel: "רק 35 ₪ לכניסה!",
        price: "350 ₪",
        featured: true,
        href: "#",
      },
      {
        id: "3",
        name: "כרטיסייה 20 כניסות",
        entries: 20,
        entriesLabel: "20 כניסות",
        perEntryLabel: "רק 32.5 ₪ לכניסה!",
        price: "650 ₪",
        featured: false,
        href: "#",
      },
    ],
  },
} satisfies Meta<typeof ShopSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
