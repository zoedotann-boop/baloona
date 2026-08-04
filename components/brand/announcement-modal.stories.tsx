import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { AnnouncementModal } from "./announcement-modal"

const meta = {
  title: "Brand/AnnouncementModal",
  component: AnnouncementModal,
  parameters: { layout: "fullscreen" },
  args: {
    // A fresh key per render keeps the pop-up open in the docs preview.
    storageKey: "storybook:announcement",
    title: "עדכון שעות פתיחה — יום העצמאות",
    body: "שימו לב לשינויים בשעות הפעילות בחג הקרוב.",
    lines: [
      "ביום שני ה־20.04.26 נהיה פתוחים 09:30–18:00",
      "ביום שלישי, ערב יום העצמאות, נפתח 09:30–14:00",
      "יום רביעי, יום העצמאות, נהיה סגורים כל היום.",
    ],
    ctaLabel: "הבנתי, תודה",
  },
} satisfies Meta<typeof AnnouncementModal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const BodyOnly: Story = { args: { lines: undefined } }

export const LinesOnly: Story = { args: { body: undefined } }
