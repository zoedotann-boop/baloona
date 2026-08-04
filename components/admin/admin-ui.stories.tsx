import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { useState } from "react"

import { AdminCard, AdminField, AdminInput, AdminToggle } from "./admin-ui"

const meta = {
  title: "Admin/AdminUI",
  component: AdminCard,
  parameters: { backgrounds: { value: "nearwhite" } },
  args: {
    title: "פרטי קשר וכתובת",
    description: "מוצג בפוטר, בצרו-קשר ובקישורי הניווט.",
    children: null,
  },
  decorators: [
    (Story) => (
      <div className="w-[560px] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AdminCard>

export default meta
type Story = StoryObj<typeof meta>

/** The shape every admin section repeats: a card of labelled controls. */
export const Section: Story = {
  render: (args) => (
    <AdminCard {...args}>
      <div className="space-y-4">
        <AdminField label="טלפון">
          <AdminInput dir="ltr" defaultValue="03-1234567" />
        </AdminField>
        <AdminField
          label="כתובת לקבלת פניות"
          hint="לשם יישלחו טפסי יום הולדת והודעות מהאתר."
        >
          <AdminInput dir="ltr" defaultValue="hello@baloona.co.il" />
        </AdminField>
      </div>
    </AdminCard>
  ),
}

export const Toggle: Story = {
  render: () => <ToggleExample />,
}

function ToggleExample() {
  const [on, setOn] = useState(true)
  return (
    <AdminCard title="פופאפ ראשי">
      <AdminToggle
        label={on ? "פעיל — מוצג לכל המבקרים" : "כבוי"}
        checked={on}
        onChange={setOn}
      />
    </AdminCard>
  )
}
