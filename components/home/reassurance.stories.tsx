import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { storyContact } from "@/lib/story-fixtures"

import { Reassurance } from "./reassurance"

const meta = {
  title: "Home/Reassurance",
  component: Reassurance,
  parameters: { layout: "fullscreen" },
  args: {
    title: "אל תדאגו, דאגנו לכם להכל!",
    body: "אספתם את הילדים מהמסגרת? בואו ישר אלינו. תבלו יחד זמן איכות ותחזרו הביתה רק לאמבטיה חמימה, סיפור ולישון.",
    ctaLabel: "בואו לבקר",
    ctaHref: storyContact.whatsappHref,
  },
} satisfies Meta<typeof Reassurance>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
