"use client"

import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useState, useTransition } from "react"

import { Logo } from "@/components/brand/logo"
import { PillButton } from "@/components/brand/pill-button"
import { authClient } from "@/lib/auth-client"

import { AdminInput } from "./admin-ui"

/** Email + password sign-in. Sign-up is closed; owners create accounts. */
function AdminLoginForm() {
  const t = useTranslations("admin.signIn")
  const router = useRouter()
  const [error, setError] = useState(false)
  const [pending, start] = useTransition()

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setError(false)

    start(async () => {
      const result = await authClient.signIn.email({
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
      })
      if (result.error) {
        setError(true)
        return
      }
      router.push("/admin")
      router.refresh()
    })
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-brand-pink-soft px-5">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-[28px] border border-border bg-white p-8"
      >
        <Logo size="md" className="mb-1" />
        <h1 className="font-heading text-[24px] font-black text-brand-plum">
          {t("title")}
        </h1>
        <p className="mt-1 mb-6 text-[15px] text-muted-foreground">
          {t("subtitle")}
        </p>

        <div className="space-y-4">
          <div>
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
              autoComplete="username"
              required
              dir="ltr"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-[13px] font-bold text-brand-plum"
            >
              {t("password")}
            </label>
            <AdminInput
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              dir="ltr"
            />
          </div>

          {error && (
            <p role="alert" className="text-[14px] font-bold text-destructive">
              {t("error")}
            </p>
          )}

          <PillButton
            type="submit"
            size="md"
            className="w-full"
            disabled={pending}
          >
            {pending ? t("pending") : t("submit")}
          </PillButton>
        </div>
      </form>
    </div>
  )
}

export { AdminLoginForm }
