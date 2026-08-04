import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  storyContact,
  storyHours,
  storyLocationId,
  storySubjects,
} from "@/lib/story-fixtures"

import { ContactSection } from "./contact-section"

const meta = {
  title: "Home/ContactSection",
  component: ContactSection,
  parameters: { layout: "fullscreen" },
  args: {
    locationId: storyLocationId,
    title: "צרו קשר",
    eyebrow: "משאירים לנו הודעה — נחזור אליכם בשעות הפעילות",
    contact: storyContact,
    hours: storyHours,
    subjects: storySubjects,
  },
} satisfies Meta<typeof ContactSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
