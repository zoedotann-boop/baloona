import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { storyPaths } from "@/lib/story-fixtures"

import { MenuTeaser } from "./menu-teaser"

const meta = {
  title: "Home/MenuTeaser",
  component: MenuTeaser,
  parameters: { layout: "fullscreen" },
  args: {
    title: "המזנון שלנו",
    body: "כשהילדים משחקים — גם ההורים נהנים. מזנון ביתי עם אוכל חם, קפה איכותי ומתוקים.",
    ctaLabel: "לתפריט המלא",
    ctaHref: storyPaths.menu,
    tiles: [
      { id: "1", label: "אוכל חם" },
      { id: "2", label: "קפה ושתייה" },
      { id: "3", label: "מתוקים" },
      { id: "4", label: "לגדולים" },
      { id: "5", label: "המלצות השף" },
      { id: "6", label: "מוגש במקום" },
    ],
  },
} satisfies Meta<typeof MenuTeaser>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
