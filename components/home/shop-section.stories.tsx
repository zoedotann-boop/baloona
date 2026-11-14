import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { ShopSection } from "./shop-section"

const meta = {
  title: "Home/ShopSection",
  component: ShopSection,
  args: {
    title: "הכרטיסיות של בלונה",
    subtitle: "רכשו כרטיסייה דיגיטלית ותיהנו מכניסות במחיר משתלם.",
    note: "תקף בכל הסניפים",
    paymentNote: "התשלום מתבצע בסניף במזומן או בכרטיס אשראי",
    popularLabel: "הבחירה הפופולרית",
    buyLabel: "לרכישה",
    cardCaptions: {
      age12: "כרטיסיית כניסה לילדים עד גיל 12",
      age2: "כרטיסיית כניסה לילדים עד גיל שנתיים",
    },
    benefits: [
      "נשמר בנייד — אין יותר כרטיסיות שהולכות לאיבוד",
      "תקף לכל המשפחה — גם לאחים ולאחיות",
      "עדכון יתרה אוטומטי אחרי כל ביקור",
    ],
    products: [
      {
        id: "1",
        name: "כרטיסייה לגילאי 2–12",
        perEntryLabel: "רק 45 ₪ לכניסה!",
        entries: 10,
        price: "450 ₪",
        featured: false,
        theme: "age12",
        href: "#",
      },
      {
        id: "2",
        name: "כרטיסייה עד גיל שנתיים",
        perEntryLabel: "רק 35 ₪ לכניסה!",
        entries: 10,
        price: "350 ₪",
        featured: true,
        theme: "age2",
        href: "#",
      },
    ],
  },
} satisfies Meta<typeof ShopSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
