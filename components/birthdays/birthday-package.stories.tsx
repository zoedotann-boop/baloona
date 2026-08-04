import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { BirthdayPackage } from "./birthday-package"

const meta = {
  title: "Birthdays/BirthdayPackage",
  component: BirthdayPackage,
  parameters: { layout: "fullscreen" },
  args: {
    packageTitle: "חבילת יום הולדת",
    price: "1,990 ₪",
    subtitle: "ל-25 ילדים · 49 ₪ לכל ילד נוסף",
    includedTitle: "מה כלול בחבילה",
    includedLines: [
      "שעתיים גישה חופשית למתקנים",
      "חדר יום הולדת פרטי",
      "2 משולשי פיצה וטרופית לכל ילד",
      "טקס עוגה ע״י צוות המקום",
    ],
    depositNote: "מקדמה לשריון: 400 ₪ (תקוזז מהסכום הסופי)",
    upgradesTitle: "תוספות ושדרוגים",
    upgrades: [
      { id: "1", label: "10 כוסות קפה", price: "90 ₪" },
      { id: "2", label: "קילו כדורי שוקולד", price: "130 ₪" },
    ],
    rulesTitle: "חוקים חשובים",
    rules: [
      "בשישי החל מ-15:00 סגור לקהל הרחב בתוספת 1000 ₪.",
      "איסור מוחלט על פיניאטות, תותחי קונפטי וקומקום/מייחם.",
    ],
  },
} satisfies Meta<typeof BirthdayPackage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
