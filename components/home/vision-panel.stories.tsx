import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { VisionPanel } from "./vision-panel"

const meta = {
  title: "Home/VisionPanel",
  component: VisionPanel,
  parameters: { layout: "fullscreen" },
  args: {
    title: "מקום אחד לכל המשפחה",
    body: "אנחנו מאמינים שאפשר להיות הורים ועדיין ליהנות מרגע לעצמנו. לכן בנינו מרחב גדול ויפה, עם בית קפה שפתוח לאורך כל היום.",
    imageUrl: "/assets/gallery/gallery-3.png",
  },
} satisfies Meta<typeof VisionPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
