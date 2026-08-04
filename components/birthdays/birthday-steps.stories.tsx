import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { BirthdaySteps } from "./birthday-steps"

const meta = {
  title: "Birthdays/BirthdaySteps",
  component: BirthdaySteps,
  parameters: { layout: "fullscreen" },
  args: {
    title: "איך זה עובד?",
    note: "* במהלך כל האירוע מסופקים לילדים קנקני מים ופטל באופן חופשי, ללא עלות.",
    steps: [
      {
        id: "1",
        title: "גישה חופשית למתקנים",
        subtitle: "שעתיים של כיף + חדר פרטי",
      },
      { id: "2", title: "פיצה וטרופית", subtitle: "2 משולשי פיצה לכל ילד" },
      { id: "3", title: "מים ופטל חופשי", subtitle: "קנקנים לאורך כל האירוע" },
      { id: "4", title: "טקס עוגה", subtitle: "ע״י צוות המקום" },
    ],
  },
} satisfies Meta<typeof BirthdaySteps>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
