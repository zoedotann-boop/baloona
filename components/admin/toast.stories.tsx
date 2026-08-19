import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { PillButton } from "@/components/brand/pill-button"

import { ToastProvider, useToast } from "./toast"

const meta = {
  title: "Admin/Toast",
  component: ToastProvider,
  parameters: { backgrounds: { value: "nearwhite" } },
  decorators: [
    (Story) => (
      <ToastProvider>
        <div className="flex h-[260px] w-[560px] max-w-full items-start gap-3">
          <Story />
        </div>
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof ToastProvider>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Results of an action the editor just took. Anchored to the viewport rather
 * than to the button, so "did that work?" is answered in the same place every
 * time. Each dismisses itself after four seconds, or on click.
 */
export const Default: Story = {
  render: () => <Example />,
  args: { children: null },
}

function Example() {
  const toast = useToast()

  return (
    <>
      <PillButton
        type="button"
        size="sm"
        onClick={() => toast("השינויים פורסמו")}
      >
        פרסום שינויים
      </PillButton>
      <PillButton
        type="button"
        size="sm"
        variant="outline"
        onClick={() => toast("השמירה נכשלה. נסו שוב.", "error")}
      >
        שמירה שנכשלת
      </PillButton>
    </>
  )
}
