import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { AnnouncementModal } from "./announcement-modal"

const meta = {
  title: "Brand/AnnouncementModal",
  component: AnnouncementModal,
  parameters: { layout: "fullscreen" },
  // The modal hides itself once dismissed (persisted in localStorage); clear it
  // before each render so the story always shows the open dialog.
  beforeEach: () => {
    localStorage.clear()
  },
} satisfies Meta<typeof AnnouncementModal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
