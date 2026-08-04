import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { useState } from "react"

import { AdminField, AdminInput } from "./admin-ui"
import { RowList } from "./row-list"

interface Upgrade {
  label: string
  amount: number
}

const meta = {
  title: "Admin/RowList",
  component: RowList<Upgrade>,
  parameters: { backgrounds: { value: "nearwhite" } },
  decorators: [
    (Story) => (
      <div className="w-[560px] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RowList<Upgrade>>

export default meta
type Story = StoryObj<typeof meta>

/** Ordered, editable rows — the shape used for menu items, upgrades, tiers. */
export const Default: Story = {
  render: () => <Example />,
  args: {
    items: [],
    onChange: () => {},
    createItem: () => ({ label: "", amount: 0 }),
    addLabel: "הוספת תוספת",
    renderRow: () => null,
  },
}

function Example() {
  const [items, setItems] = useState<Upgrade[]>([
    { label: "10 כוסות קפה", amount: 90 },
    { label: "קילו כדורי שוקולד", amount: 130 },
  ])

  return (
    <RowList
      items={items}
      onChange={setItems}
      createItem={() => ({ label: "", amount: 0 })}
      addLabel="הוספת תוספת"
      emptyLabel="עדיין אין פריטים כאן."
      renderRow={(item, _index, update) => (
        <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
          <AdminField label="שם התוספת">
            <AdminInput
              value={item.label}
              onChange={(event) =>
                update({ ...item, label: event.target.value })
              }
            />
          </AdminField>
          <AdminField label="מחיר (₪)">
            <AdminInput
              type="number"
              value={item.amount}
              onChange={(event) =>
                update({ ...item, amount: Number(event.target.value) || 0 })
              }
            />
          </AdminField>
        </div>
      )}
    />
  )
}
