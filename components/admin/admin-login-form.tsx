"use client"

import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useState, useTransition } from "react"

import { Logo } from "@/components/brand/logo"
import { PillButton } from "@/components/brand/pill-button"
import { authClient } from "@/lib/auth-client"

import { AdminInput } from "./admin-ui"

function AdminLoginForm() {
  const t = useTranslations("admin.signIn")
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()

  function requestCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = String(new FormData(event.currentTarget).get("email") ?? "")
    setError(null)

    start(async () => {
      const result = await authClient.emailOtp.sendVerificationOtp({
        email: value,
        type: "sign-in",
      })
      if (result.error) {
        setError(t("sendError"))
        return
      }
      setEmail(value)
      setSent(true)
    })
  }

  function verifyCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const otp = String(new FormData(event.currentTarget).get("code") ?? "")
    setError(null)

    start(async () => {
      const result = await authClient.signIn.emailOtp({ email, otp })
      if (result.error) {
        setError(t("error"))
        return
      }
      router.push("/admin")
      router.refresh()
    })
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-brand-pink-soft px-5">
      <form
        onSubmit={sent ? verifyCode : requestCode}
        className="w-full max-w-sm rounded-[28px] border border-border bg-white p-8"
      >
        <Logo size="md" className="mb-1" />
        <h1 className="font-heading text-[24px] font-black text-brand-plum">
          {t("title")}
        </h1>
        <p className="mt-1 mb-6 text-[15px] text-muted-foreground">
          {sent ? t("codeSent", { email }) : t("subtitle")}
        </p>

        <div className="space-y-4">
          {sent ? (
            <div key="code">
              <label
                htmlFor="code"
                className="mb-1.5 block text-[13px] font-bold text-brand-plum"
              >
                {t("code")}
              </label>
              <AdminInput
                id="code"
                name="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                autoFocus
                dir="ltr"
                className="text-center tracking-[0.4em]"
              />
            </div>
          ) : (
            <div key="email">
              <label
                htmlFor="email"
                className="mb-1.5 block text-[13px] font-bold text-brand-plum"
              >
                {t("email")}
              </label>
              <AdminInput
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                dir="ltr"
              />
            </div>
          )}

          {error && (
            <p role="alert" className="text-[14px] font-bold text-destructive">
              {error}
            </p>
          )}

          <PillButton
            type="submit"
            size="md"
            className="w-full"
            disabled={pending}
          >
            {pending
              ? sent
                ? t("pending")
                : t("sending")
              : sent
                ? t("submit")
                : t("sendCode")}
          </PillButton>

          {sent && (
            <button
              type="button"
              onClick={() => {
                setSent(false)
                setError(null)
              }}
              className="block w-full text-[14px] font-bold text-muted-foreground underline"
            >
              {t("changeEmail")}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export { AdminLoginForm }
