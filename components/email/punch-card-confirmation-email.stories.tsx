import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { createTranslator } from "next-intl"
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

const t = createTranslator({ locale: "he", messages, namespace: "emails" })

function confirmationArgs(entries: number): PunchCardConfirmationEmailProps {
  const size = { total: entries }
  return {
    locale: "he",
    preview: t("punchCard.preview", size),
    eyebrow: t("punchCard.eyebrow", size),
    heading: t("punchCard.heading", size),
    intro: t("punchCard.intro", size),
    rows: [
      {
        label: t("punchCard.entriesLabel"),
        value: t("punchCard.entriesValue", { count: entries }),
      },
    ],
    buttonLabel: t("punchCard.viewCard", size),
    cardUrl: "https://baloona.co.il/card/preview-token",
    signoff: t("punchCard.signoff"),
    footer: t("shell.footer"),
  }
}

const meta = {
  title: "Email/Punch card confirmation",
  component: EmailPreview,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof EmailPreview>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: confirmationArgs(10),
}

export const SingleEntry: Story = {
  args: confirmationArgs(1),
}
