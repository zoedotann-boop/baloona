import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Confetti } from "./confetti"

const meta = {
  title: "Brand/Confetti",
  component: Confetti,
  parameters: { layout: "fullscreen", backgrounds: { value: "nearwhite" } },
  render: () => (
    <div className="relative h-[360px] overflow-hidden">
      <Confetti />
      <div className="flex h-full items-center justify-center font-heading text-[24px] font-black text-brand-plum">
        רקע קונפטי
      </div>
    </div>
  ),
} satisfies Meta<typeof Confetti>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
