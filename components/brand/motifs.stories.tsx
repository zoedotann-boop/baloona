import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  Bee,
  Bird,
  Butterfly,
  Castle,
  Cloud,
  Elephant,
  Flamingo,
  Flower,
  Giraffe,
  Heart,
  Hills,
  HotAirBalloon,
  MarketStall,
  PalmTree,
  PartyBalloon,
  Penguin,
  Rabbit,
  Rhino,
  Sun,
  TownSilhouette,
  Tree,
  Windmill,
  WolfOnBike,
  Zebra,
} from "./motifs"

const meta = {
  title: "Brand/Motifs",
  component: Cloud,
  parameters: { backgrounds: { value: "pink" } },
} satisfies Meta<typeof Cloud>

export default meta
type Story = StoryObj<typeof meta>

/** The full illustration cast, sized off their wrappers. */
export const Gallery: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-8">
      <Cloud className="w-32" />
      <HotAirBalloon
        className="h-40"
        color="var(--brand-rose)"
        pattern="dots"
      />
      <HotAirBalloon
        className="h-40"
        color="var(--brand-lavender)"
        pattern="scallop"
      />
      <PartyBalloon className="h-36" color="var(--brand-mint)" />
      <Flamingo className="h-48" />
      <Giraffe className="h-52" />
      <Penguin className="h-40" />
      <WolfOnBike className="w-52" />
      <Rhino className="h-32" />
      <Elephant className="h-32" />
      <Zebra className="h-36" />
      <Rabbit className="h-28" />
      <Sun className="h-24" />
      <Tree className="h-36" />
      <PalmTree className="h-40" />
      <Windmill className="h-44" />
      <Castle className="h-40" />
      <MarketStall className="h-36" />
      <Flower className="h-24" />
      <Bird className="w-16" />
      <Bee className="w-16" />
      <Butterfly className="w-14" />
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

/** The café-banner cast — the giraffe, wolf-on-bike and penguin. */
export const CafeScene: Story = {
  parameters: { backgrounds: { value: "nearwhite" } },
  render: () => (
    <div className="relative h-72 w-[520px] overflow-hidden rounded-[28px] bg-brand-pink-soft">
      <Cloud className="absolute top-4 left-6 w-24" />
      <Cloud className="absolute top-8 right-10 w-20 opacity-80" />
      <Butterfly className="absolute top-24 left-24 w-10" />
      <Giraffe className="absolute bottom-2 left-6 h-56" />
      <WolfOnBike className="absolute right-6 bottom-8 w-56" />
      <Penguin className="absolute bottom-4 left-40 h-24" />
    </div>
  ),
}
