import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { renderToStaticMarkup } from "react-dom/server"

import messages from "@/messages/he.json"

import {
  LeadNotificationEmail,
  type LeadNotificationEmailProps,
} from "./lead-notification-email"

// Emails render to a full HTML document, so preview them inside an iframe rather
// than mounting <Html>/<Body> into the Storybook DOM (which would nest a second
// document and confuse the a11y checks).
function EmailPreview(props: LeadNotificationEmailProps) {
  const html = renderToStaticMarkup(<LeadNotificationEmail {...props} />)
  return (
    <iframe
      title={props.heading}
      srcDoc={html}
      style={{ width: 640, height: 560, border: "none" }}
    />
  )
}

const { shell, lead } = messages.emails

const meta = {
  title: "Email/Lead notification",
  component: EmailPreview,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof EmailPreview>

export default meta

type Story = StoryObj<typeof meta>

export const Contact: Story = {
  args: {
    locale: "he",
    heading: lead.contact.heading,
    preview: lead.contact.preview,
    footer: shell.footer,
    locationName: "בלונה סנט ג׳ורג׳",
    rows: [
      { label: lead.labels.name, value: "דנה כהן" },
      { label: lead.labels.phone, value: "050-1234567" },
      { label: lead.labels.subject, value: "ימי הולדת" },
      {
        label: lead.labels.message,
        value: "היי, אשמח לקבל פרטים על חבילות יום הולדת לגיל 5 בסוף השבוע.",
      },
    ],
  },
}

export const Birthday: Story = {
  args: {
    locale: "he",
    heading: lead.birthday.heading,
    preview: lead.birthday.preview,
    footer: shell.footer,
    locationName: "בלונה סנט ג׳ורג׳",
    rows: [
      { label: lead.labels.name, value: "יוסי לוי" },
      { label: lead.labels.phone, value: "052-7654321" },
      { label: "תאריך מבוקש", value: "12/09/2026" },
      { label: "מספר ילדים", value: "18" },
      { label: lead.labels.upgrades, value: "עמדת פופקורן, ליצן" },
      { label: lead.labels.estimatedTotal, value: "1,450 ₪" },
    ],
  },
}
