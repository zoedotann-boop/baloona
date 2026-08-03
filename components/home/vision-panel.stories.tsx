import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { VisionPanel } from "./vision-panel"

const meta = {
  title: "Home/VisionPanel",
  component: VisionPanel,
  parameters: { layout: "fullscreen", backgrounds: { value: "nearwhite" } },
} satisfies Meta<typeof VisionPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
