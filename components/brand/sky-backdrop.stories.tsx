import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { SkyBackdrop } from "./sky-backdrop"

const meta = {
  title: "Brand/SkyBackdrop",
  component: SkyBackdrop,
  parameters: { layout: "fullscreen", backgrounds: { value: "nearwhite" } },
  render: (args) => (
    <div className="relative h-[480px] overflow-hidden">
      <SkyBackdrop {...args} />
      <div className="flex h-full items-center justify-center font-heading text-[24px] font-black text-brand-plum">
        רקע שמיים
      </div>
    </div>
  ),
} satisfies Meta<typeof SkyBackdrop>

export default meta
type Story = StoryObj<typeof meta>

/** Hot-air balloons + clouds + hearts (the default sky). */
export const Default: Story = {}

/** Round party balloons — the birthday flavour. */
export const Party: Story = { args: { variant: "party" } }

/** Sky with the mint hills + flamingo along the bottom (the punch-card scene). */
export const Ground: Story = {
  args: { ground: true },
  parameters: { backgrounds: { value: "pink" } },
}
