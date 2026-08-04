import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { MenuBoard } from "./menu-board"

const meta = {
  title: "Menu/MenuBoard",
  component: MenuBoard,
  parameters: { layout: "fullscreen" },
  args: {
    title: "התפריט שלנו",
    description: "אוכל טרי, קפה טוב ומתוקים לילדים — הכל במקום.",
    note: "* התפריט מתעדכן מעת לעת ועשוי להשתנות לפי עונה ומלאי.",
    categories: [
      {
        id: "food",
        label: "אוכל",
        items: [
          {
            id: "1",
            name: "נקניקיה בלחמניה",
            description: "",
            price: "15 ₪",
          },
          {
            id: "2",
            name: "טוסט סוגר פינה",
            description: "גבינה צהובה, עגבניה, מלפפון",
            price: "28 ₪",
          },
        ],
      },
      {
        id: "sweet",
        label: "מתוקים",
        items: [
          {
            id: "3",
            name: "ופל בלגי",
            description: "עם אבקת סוכר ונוטלה",
            price: "28 ₪",
          },
        ],
      },
    ],
  },
} satisfies Meta<typeof MenuBoard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
