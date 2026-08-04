import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { LocationChooser } from "./location-chooser"

const meta = {
  title: "Locations/LocationChooser",
  component: LocationChooser,
  parameters: { layout: "fullscreen" },
  args: {
    locations: [
      {
        slug: "kiryat-ono",
        name: "בלונה קרית אונו",
        city: "קרית אונו",
        address: "רחוב שלמה המלך 37 (קניון קרית אונו) בניין B קומה מינוס 2",
        description: "מתחם ג׳ימבורי של 3 קומות לילדים בגילאי 1–9.",
        imageUrl: "/assets/gallery/gallery-1.png",
      },
      {
        slug: "tel-aviv",
        name: "בלונה תל אביב",
        city: "תל אביב",
        address: "רחוב אבן גבירול 71, תל אביב",
        description: "משחקייה ובית קפה בלב העיר.",
        imageUrl: "/assets/gallery/gallery-2.png",
      },
    ],
  },
} satisfies Meta<typeof LocationChooser>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Empty: Story = { args: { locations: [] } }
