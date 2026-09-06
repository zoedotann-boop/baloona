import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { renderToStaticMarkup } from "react-dom/server"

import messages from "@/messages/he.json"

import {
  PunchCardConfirmationEmail,
  type PunchCardConfirmationEmailProps,
} from "./punch-card-confirmation-email"

function EmailPreview(props: PunchCardConfirmationEmailProps) {
  const html = renderToStaticMarkup(<PunchCardConfirmationEmail {...props} />)
  return (
    <iframe
      title={props.heading}
      srcDoc={html}
      style={{ width: 640, height: 620, border: "none" }}
    />
  )
}

const { shell, punchCard } = messages.emails

const meta = {
  title: "Email/Punch card confirmation",
  component: EmailPreview,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof EmailPreview>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    locale: "he",
    preview: punchCard.preview,
    eyebrow: punchCard.eyebrow,
    heading: punchCard.heading,
    intro: punchCard.intro,
    rows: [
      {
        label: punchCard.entriesLabel,
        value: punchCard.entriesValue.replace("{count}", "10"),
      },
    ],
    buttonLabel: punchCard.viewCard,
    cardUrl: "https://baloona.co.il/card/preview-token",
    signoff: punchCard.signoff,
    footer: shell.footer,
  },
}
