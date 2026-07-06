import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { MenuBoard } from "./menu-board"

const meta = {
  title: "Menu/MenuBoard",
  component: MenuBoard,
  parameters: { layout: "fullscreen", backgrounds: { value: "pink" } },
} satisfies Meta<typeof MenuBoard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
