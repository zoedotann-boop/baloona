import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { renderToStaticMarkup } from "react-dom/server"

import messages from "@/messages/he.json"

import { LoginOtpEmail, type LoginOtpEmailProps } from "./login-otp-email"

function EmailPreview(props: LoginOtpEmailProps) {
  const html = renderToStaticMarkup(<LoginOtpEmail {...props} />)
  return (
    <iframe
      title={props.heading}
      srcDoc={html}
      style={{ width: 640, height: 620, border: "none" }}
    />
  )
}

const { shell, loginOtp } = messages.emails

const meta = {
  title: "Email/Login OTP",
  component: EmailPreview,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof EmailPreview>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    locale: "he",
    preview: loginOtp.preview,
    eyebrow: loginOtp.eyebrow,
    heading: loginOtp.heading,
    intro: loginOtp.intro,
    otp: "482915",
    expiry: loginOtp.expiry,
    footer: shell.footer,
  },
}
