import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Reveal } from "./reveal"

const meta = {
  title: "Brand/Reveal",
  component: Reveal,
  parameters: { backgrounds: { value: "lavender" } },
  args: { children: null },
} satisfies Meta<typeof Reveal>

export default meta
type Story = StoryObj<typeof meta>

function DemoCard({ label }: { label: string }) {
  return (
    <div className="rounded-[20px] border border-border bg-white p-6 text-foreground">
      {label}
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <div className="w-[320px]">
      <Reveal>
        <DemoCard label="נחשף בגלילה" />
      </Reveal>
    </div>
  ),
}

export const StaggeredRow: Story = {
  render: () => (
    <div className="grid w-[720px] grid-cols-3 gap-4">
      {["ראשון", "שני", "שלישי"].map((label, i) => (
        <Reveal key={label} delay={i * 120}>
          <DemoCard label={label} />
        </Reveal>
      ))}
    </div>
  ),
}
