import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { useState } from "react"

import { ConfirmModal } from "./confirm-modal"

const meta = {
  title: "Admin/ConfirmModal",
  component: ConfirmModal,
  parameters: { backgrounds: { value: "nearwhite" } },
} satisfies Meta<typeof ConfirmModal>

export default meta
type Story = StoryObj<typeof meta>

const noop = {
  open: true,
  onClose: () => {},
  onConfirm: () => {},
  title: "",
  message: "",
}

/**
 * Deleting a row from a draft list. The wording says the deletion only lands on
 * publish, because until then the editor can simply not save.
 */
export const DraftRow: Story = {
  render: () => (
    <Example
      title="תאיר מור"
      message="השורה תוסר מהרשימה. המחיקה תיכנס לתוקף כשתפרסמו את השינויים."
    />
  ),
  args: noop,
}

/**
 * Deleting a branch, a team member or an enquiry — a server action that lands
 * straight away, so the wording says so.
 */
export const Immediate: Story = {
  render: () => (
    <Example
      title="בלונה גני תקווה"
      message="הפעולה מיידית ולא ניתן לבטל אותה."
      confirmLabel="מחיקת סניף"
    />
  ),
  args: noop,
}

function Example({
  title,
  message,
  confirmLabel,
}: {
  title: string
  message: string
  confirmLabel?: string
}) {
  const [open, setOpen] = useState(true)
  const [done, setDone] = useState(false)

  return (
    <div className="w-[420px] max-w-full space-y-3">
      <button
        type="button"
        onClick={() => {
          setDone(false)
          setOpen(true)
        }}
        className="inline-flex h-9 items-center rounded-full bg-destructive px-4 text-[14px] font-extrabold text-white"
      >
        מחיקה
      </button>

      {done && (
        <p role="status" className="text-[14px] font-bold text-brand-plum">
          אושר
        </p>
      )}

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => setDone(true)}
        title={title}
        message={message}
        confirmLabel={confirmLabel}
      />
    </div>
  )
}
