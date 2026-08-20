import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { LegalPage } from "./legal-page"

const meta = {
  title: "Layout/LegalPage",
  component: LegalPage,
  parameters: { layout: "fullscreen" },
  args: {
    title: "הצהרת נגישות",
    intro: "אנחנו מחויבים להנגיש את האתר לכלל המשתמשים.",
    children: (
      <div className="flex flex-col gap-6 text-[17px] leading-relaxed text-muted-foreground">
        <p>
          האתר נבנה בהתאם להנחיות הנגישות ונבדק מול טכנולוגיות מסייעות נפוצות.
        </p>
        <p>נשמח לקבל פניות ובקשות לשיפור הנגישות בכל עת.</p>
      </div>
    ),
  },
} satisfies Meta<typeof LegalPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithMeta: Story = {
  args: { title: "תקנון ומדיניות ביטול", meta: "עודכן לאחרונה: אוגוסט 2026" },
}
