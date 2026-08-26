import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  Cloud,
  Flamingo,
  Heart,
  Hills,
  PartyBalloon,
  Sun,
  TownSilhouette,
} from "./motifs"

const meta = {
  title: "Brand/Motifs",
  component: Cloud,
  parameters: { backgrounds: { value: "pink" } },
} satisfies Meta<typeof Cloud>

export default meta
type Story = StoryObj<typeof meta>

/** The generative, token-driven motifs, sized off their wrappers. */
export const Gallery: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-8">
      <Cloud className="w-32" />
      <PartyBalloon className="h-36" color="var(--brand-mint)" />
      <Flamingo className="h-48" />
      <Sun className="h-24" />
      <TownSilhouette className="h-16 w-64" />
      <Hills className="h-24 w-64" />
      <Heart className="w-10" />
    </div>
  ),
}

/** A flamingo on the mint hills, as on the pink punch card. */
export const FlamingoOnHills: Story = {
  render: () => (
    <div className="relative h-64 w-72 overflow-hidden rounded-[28px] bg-brand-pink">
      <Cloud className="absolute top-3 left-4 w-20" />
      <Hills className="absolute inset-x-0 bottom-0 h-20 w-full" />
      <Flamingo className="absolute right-6 bottom-2 h-40" />
    </div>
  ),
}
