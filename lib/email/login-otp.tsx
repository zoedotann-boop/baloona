import "server-only"

import { render } from "@react-email/render"
import { getTranslations } from "next-intl/server"
import { Resend } from "resend"

import { LoginOtpEmail } from "@/components/email/login-otp-email"
import { defaultLocale } from "@/i18n/routing"
import { emailAssetsBaseUrl, resendConfig } from "@/lib/env"

export interface LoginOtp {
  to: string
  otp: string
}

export async function sendLoginOtp(
  message: LoginOtp
): Promise<{ sent: true } | { sent: false; error: string }> {
  const config = resendConfig()
  if (!config) return { sent: false, error: "RESEND_API_KEY is not configured" }

  const t = await getTranslations({
    locale: defaultLocale,
    namespace: "emails",
  })

  const email = (
    <LoginOtpEmail
      locale={defaultLocale}
      baseUrl={emailAssetsBaseUrl()}
      preview={t("loginOtp.preview")}
      eyebrow={t("loginOtp.eyebrow")}
      heading={t("loginOtp.heading")}
      intro={t("loginOtp.intro")}
      otp={message.otp}
      expiry={t("loginOtp.expiry")}
      footer={t("shell.footer")}
    />
  )
  const [html, text] = await Promise.all([
    render(email),
    render(email, { plainText: true }),
  ])

  try {
    const { error } = await new Resend(config.apiKey).emails.send({
      from: config.from,
      to: message.to,
      subject: t("loginOtp.subject"),
      html,
      text,
    })
    if (error) return { sent: false, error: error.message }
    return { sent: true }
  } catch (error) {
    return { sent: false, error: (error as Error).message }
  }
}
