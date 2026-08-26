import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { renderToStaticMarkup } from "react-dom/server"

import messages from "@/messages/he.json"

import {
  BirthdayInvitationEmail,
  type BirthdayInvitationEmailProps,
} from "./birthday-invitation-email"

// Emails render to a full HTML document, so preview them inside an iframe rather
// than mounting <Html>/<Body> into the Storybook DOM.
function EmailPreview(props: BirthdayInvitationEmailProps) {
  const html = renderToStaticMarkup(<BirthdayInvitationEmail {...props} />)
  return (
    <iframe
      title={props.heading}
      srcDoc={html}
      style={{ width: 640, height: 520, border: "none" }}
    />
  )
}

const { shell, birthdayInvitation } = messages.emails

const meta = {
  title: "Email/Birthday invitation",
  component: EmailPreview,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof EmailPreview>

export default meta

type Story = StoryObj<typeof meta>

export const Named: Story = {
  args: {
    locale: "he",
    preview: birthdayInvitation.preview,
    eyebrow: birthdayInvitation.eyebrow,
    heading: birthdayInvitation.headingNamed.replace("{name}", "נועה"),
    paragraphs: [birthdayInvitation.intro, birthdayInvitation.body],
    signoff: birthdayInvitation.signoff,
    footer: shell.footer,
  },
}

export const WithoutName: Story = {
  args: {
    locale: "he",
    preview: birthdayInvitation.preview,
    eyebrow: birthdayInvitation.eyebrow,
    heading: birthdayInvitation.heading,
    paragraphs: [birthdayInvitation.intro, birthdayInvitation.body],
    signoff: birthdayInvitation.signoff,
    footer: shell.footer,
  },
}
