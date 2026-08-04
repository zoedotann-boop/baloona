import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { storyGallery } from "@/lib/story-fixtures"

import { Gallery } from "./gallery"

const meta = {
  title: "Home/Gallery",
  component: Gallery,
  parameters: { layout: "fullscreen" },
  args: { title: "הצצה קטנה למתחם", images: storyGallery },
} satisfies Meta<typeof Gallery>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
