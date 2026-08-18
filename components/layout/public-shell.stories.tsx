import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { PublicShell } from "./public-shell"

const meta = {
  title: "Layout/PublicShell",
  component: PublicShell,
  parameters: { layout: "fullscreen" },
  args: {
    header: (
      <header className="flex h-[74px] items-center border-b border-border bg-brand-cloud px-5 md:px-9">
        כותרת
      </header>
    ),
    footer: (
      <footer className="bg-brand-cloud px-5 py-8 text-center text-brand-plum md:px-9">
        כותרת תחתונה
      </footer>
    ),
    children: (
      <div className="px-5 py-20 text-center text-brand-plum md:px-9">
        תוכן העמוד
      </div>
    ),
  },
} satisfies Meta<typeof PublicShell>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithoutFooter: Story = { args: { footer: undefined } }
