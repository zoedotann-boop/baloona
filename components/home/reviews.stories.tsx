import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { storyGallery } from "@/lib/story-fixtures"

import { Reviews } from "./reviews"

const meta = {
  title: "Home/Reviews",
  component: Reviews,
  parameters: { layout: "fullscreen" },
  args: {
    title: "הורים מספרים",
    items: [
      {
        id: "1",
        text: "המקום מהמם, הילדים לא רצו לצאת! נקי, בטוח והצוות פשוט מקסים.",
        name: "מיכל ל.",
        initials: "מל",
        ago: "לפני שבוע",
        rating: 5,
      },
      {
        id: "2",
        text: "סוף סוף מקום שגם ההורים נהנים בו. הקפה מעולה והילדים משתוללים בבטחה.",
        name: "דנה כ.",
        initials: "דכ",
        ago: "לפני שבועיים",
        rating: 5,
      },
      {
        id: "3",
        text: "חגגנו יום הולדת לבן והכל היה מושלם — חדר פרטי, פיצה וטקס עוגה.",
        name: "יוסי א.",
        initials: "יא",
        ago: "לפני חודש",
        rating: 4,
      },
    ],
    photos: storyGallery.slice(3).map(({ url, alt }) => ({ url, alt })),
  },
} satisfies Meta<typeof Reviews>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
