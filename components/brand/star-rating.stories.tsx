import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { StarRating } from "./star-rating"

const meta = {
  title: "Brand/StarRating",
  component: StarRating,
  parameters: { backgrounds: { value: "white" } },
  argTypes: {
    rating: { control: { type: "range", min: 0, max: 5, step: 1 } },
  },
  args: { rating: 5, max: 5 },
} satisfies Meta<typeof StarRating>

export default meta
type Story = StoryObj<typeof meta>

export const Full: Story = {}

export const Partial: Story = { args: { rating: 4 } }
