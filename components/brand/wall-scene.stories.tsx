import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { WallScene } from "./wall-scene"

const meta = {
  title: "Brand/WallScene",
  component: WallScene,
  parameters: { layout: "fullscreen" },
  render: (args) => (
    <div className="relative h-[520px] overflow-hidden">
      <WallScene {...args} />
      <div className="flex h-full items-start justify-center pt-10 font-heading text-[26px] font-black text-brand-plum">
        כותרת לדוגמה
      </div>
    </div>
  ),
} satisfies Meta<typeof WallScene>

export default meta
type Story = StoryObj<typeof meta>

export const Cafe: Story = { args: { variant: "cafe" } }
export const Meadow: Story = { args: { variant: "meadow" } }
export const Market: Story = { args: { variant: "market" } }
export const Mountains: Story = { args: { variant: "mountains" } }
export const Savanna: Story = { args: { variant: "savanna" } }
export const Town: Story = { args: { variant: "town" } }
export const Windmill: Story = { args: { variant: "windmill" } }
export const Party: Story = { args: { variant: "party" } }
