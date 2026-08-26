import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  BalloonBunch,
  Bird,
  Bunny,
  Butterfly,
  Castle,
  CatTractor,
  CloudFlat,
  CloudFluffy,
  CloudPuff,
  Cypress,
  Dove,
  Elephant,
  Fish,
  HeartsPink,
  LavenderDots,
  LavenderFlecks,
  StripedBalloon,
  Zebra,
} from "./scene-art"

const meta = {
  title: "Brand/SceneArt",
  component: CloudFluffy,
  parameters: { backgrounds: { value: "nearwhite" } },
} satisfies Meta<typeof CloudFluffy>

export default meta
type Story = StoryObj<typeof meta>

/** The full mural cast, ported from the painted Baloona walls. */
export const Gallery: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-8">
      <CloudFluffy className="w-32" />
      <CloudPuff className="w-28" />
      <CloudFlat className="w-32" />
      <StripedBalloon className="h-40" />
      <BalloonBunch className="h-44" />
      <HeartsPink className="w-12" />
      <Butterfly className="w-14" />
      <Bird className="w-16" />
      <Dove className="w-20" />
      <Bunny className="h-24" />
      <Zebra className="h-40" />
      <Elephant className="h-40" />
      <Fish className="w-16" />
      <CatTractor className="h-44" />
      <Cypress className="h-48" />
      <Castle className="h-44" />
      <LavenderDots className="w-40" />
      <LavenderFlecks className="w-24" />
    </div>
  ),
}

/** A composed pond scene — the Zone 2 wall. */
export const PondWall: Story = {
  render: () => (
    <div
      className="relative h-72 w-[560px] overflow-hidden rounded-[28px]"
      style={{ background: "var(--scene-sky-lavender)" }}
    >
      <CloudFluffy className="absolute top-6 left-8 w-28" />
      <StripedBalloon className="absolute top-6 right-10 h-32" />
      <Butterfly className="absolute top-24 left-40 w-10" />
      <Cypress className="absolute bottom-6 left-6 h-48" />
      <Bunny className="absolute bottom-24 left-40 h-16" />
      <Elephant className="absolute right-8 bottom-6 h-36" />
    </div>
  ),
}
