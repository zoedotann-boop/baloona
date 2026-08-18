import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { storyLocationId } from "@/lib/story-fixtures"

import { BirthdayLeadForm } from "./birthday-lead-form"

const meta = {
  title: "Birthdays/BirthdayLeadForm",
  component: BirthdayLeadForm,
  parameters: { layout: "fullscreen" },
  args: {
    locationId: storyLocationId,
    title: "טופס אישור והתחייבות לאירוע",
    description: "מלאו את הפרטים, בחרו את השדרוגים הרצויים וחתמו בתחתית הטופס.",
    fields: [
      {
        key: "eventDate",
        label: "תאריך אירוע מבוקש",
        type: "date",
        options: [],
        isRequired: true,
      },
      {
        key: "fullName",
        label: "שם המזמין",
        placeholder: "ישראל ישראלי",
        type: "text",
        options: [],
        isRequired: true,
      },
      {
        key: "phone",
        label: "טלפון",
        placeholder: "050-0000000",
        type: "tel",
        options: [],
        isRequired: true,
      },
      {
        key: "allergies",
        label: "אלרגיות",
        placeholder: "פרטו אם יש",
        type: "textarea",
        options: [],
        isRequired: false,
      },
    ],
    upgradesTitle: "תוספות ושדרוגים",
    upgrades: [
      { id: "1", label: "10 כוסות קפה", price: "90 ₪" },
      { id: "2", label: "קילו כדורי שוקולד", price: "130 ₪" },
    ],
    packageSummary: "חבילה ל-25 ילדים",
    packagePrice: "1,990 ₪",
    depositNote: "מקדמה לשריון: 400 ₪ (תקוזז מהסכום הסופי)",
    cancellationPolicy:
      "ביטול עד 14 יום — לא תוחזר מקדמה. 3-14 ימים — קנס 50%. פחות מ-72 שעות — חיוב מלא.",
    consentLabel:
      "אנחנו מתחייבים שקראנו את כל התנאים וההגבלות ומאשרים את כל הכתוב",
    disclaimer:
      "שליחת הטופס אינה מהווה אישור לקיום האירוע; אישור סופי נקבע מול הפקידה.",
    successMessage: "הטופס נשלח! נחזור אליכם בהקדם לתיאום האירוע. תודה 🎈",
    requiresSignature: true,
    signatureTitle: "חתימה דיגיטלית",
    signatureHint: "חתמו כאן עם העכבר או האצבע",
  },
} satisfies Meta<typeof BirthdayLeadForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
