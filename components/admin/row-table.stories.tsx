import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { useState } from "react"

import { AdminField, AdminFlag, AdminInput, AdminToggle } from "./admin-ui"
import { RowTable } from "./row-table"

interface Upgrade {
  label: string
  amount: number
  isVisible: boolean
}

const meta = {
  title: "Admin/RowTable",
  component: RowTable<Upgrade>,
  parameters: { backgrounds: { value: "nearwhite" } },
  decorators: [
    (Story) => (
      <div className="w-[720px] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RowTable<Upgrade>>

export default meta
type Story = StoryObj<typeof meta>

const noop = {
  items: [],
  onChange: () => {},
  createItem: () => ({ label: "", amount: 0, isVisible: true }),
  addLabel: "הוספת תוספת",
  columns: [],
  editTitle: () => "",
  renderRow: () => null,
}

/**
 * Ordered rows as a compact table — the shape used for menu items, upgrades,
 * tiers and reviews. Press a row's pencil to open its full form in a dialog.
 */
export const Default: Story = {
  render: () => <Example />,
  args: noop,
}

/** The empty state an editor lands on before adding the first row. */
export const Empty: Story = {
  render: () => <Example initial={[]} />,
  args: noop,
}

function Example({
  initial = [
    { label: "10 כוסות קפה", amount: 90, isVisible: true },
    { label: "קילו כדורי שוקולד", amount: 130, isVisible: true },
    { label: "צלם מקצועי לשעה", amount: 450, isVisible: false },
  ],
}: {
  initial?: Upgrade[]
}) {
  const [items, setItems] = useState<Upgrade[]>(initial)

  return (
    <RowTable
      items={items}
      onChange={setItems}
      createItem={() => ({ label: "", amount: 0, isVisible: true })}
      addLabel="הוספת תוספת"
      emptyLabel="עדיין אין פריטים כאן."
      columns={[
        {
          header: "שם התוספת",
          cell: (item) => item.label,
          tooltip: "השם שההורים רואים ברשימת התוספות של יום ההולדת.",
        },
        {
          header: "מחיר",
          cell: (item) => item.amount,
          className: "w-24",
          tooltip: "מחיר התוספת בשקלים, מתווסף לסכום החבילה.",
        },
        {
          header: "מוצג",
          cell: (item) => <AdminFlag on={item.isVisible} label="מוצג" />,
          className: "w-28",
          tooltip: "האם התוספת מוצעת כרגע בטופס ההזמנה.",
        },
      ]}
      editTitle={(item) => item.label || "הוספת תוספת"}
      renderRow={(item, _index, update) => (
        <div className="space-y-3">
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
          <AdminToggle
            label="מוצג באתר"
            checked={item.isVisible}
            onChange={(isVisible) => update({ ...item, isVisible })}
          />
        </div>
      )}
    />
  )
}
