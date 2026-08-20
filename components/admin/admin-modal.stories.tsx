import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { useState } from "react"

import { PillButton } from "@/components/brand/pill-button"

import { AdminModal } from "./admin-modal"
import { AdminField, AdminInput, AdminToggle } from "./admin-ui"

const meta = {
  title: "Admin/AdminModal",
  component: AdminModal,
  parameters: { backgrounds: { value: "nearwhite" } },
} satisfies Meta<typeof AdminModal>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The dialog behind every table row's edit button. It edits the section draft
 * in place, so closing it is always safe — publishing happens from the page
 * header.
 */
export const Default: Story = {
  render: () => <Example />,
  args: { open: true, onClose: () => {}, title: "", children: null },
}

function Example() {
  const [open, setOpen] = useState(true)
  const [visible, setVisible] = useState(true)

  return (
    <div className="w-[560px] max-w-full">
      <PillButton type="button" size="sm" onClick={() => setOpen(true)}>
        עריכת תוספת
      </PillButton>

      <AdminModal
        open={open}
        onClose={() => setOpen(false)}
        title="10 כוסות קפה"
      >
        <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
          <AdminField label="שם התוספת">
            <AdminInput defaultValue="10 כוסות קפה" />
          </AdminField>
          <AdminField label="מחיר (₪)">
            <AdminInput type="number" defaultValue={90} />
          </AdminField>
        </div>
        <AdminToggle
          label="מוצג באתר"
          checked={visible}
          onChange={setVisible}
        />
      </AdminModal>
    </div>
  )
}
