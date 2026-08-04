"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { ImageIcon, Upload, X } from "lucide-react"
import { useRef, useState, useTransition } from "react"

import { createMediaUpload } from "@/lib/actions/admin-tools"

import { AdminField, AdminInput } from "./admin-ui"
import { useSectionContext } from "./section-form"

type UploadFolder = "gallery" | "hero" | "steps" | "branding"

interface ImageFieldProps {
  label: string
  hint?: string
  value: string
  onChange: (url: string) => void
  folder: UploadFolder
  className?: string
}

/**
 * Pick an image by uploading it or by pasting a URL.
 *
 * Uploads go straight from the browser to R2 through a presigned PUT, so image
 * bytes never round-trip through the server. The URL stays editable so an
 * editor can point at an existing asset (or `/public`) without uploading.
 */
function ImageField({
  label,
  hint,
  value,
  onChange,
  folder,
  className,
}: ImageFieldProps) {
  const t = useTranslations("admin.common")
  const { slug } = useSectionContext()
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()

  function upload(file: File) {
    setError(null)
    start(async () => {
      const created = await createMediaUpload({
        slug,
        folder,
        fileName: file.name,
        contentType: file.type,
      })
      if (!created.ok) {
        setError(
          created.error.includes("not configured")
            ? t("uploadNotConfigured")
            : t("uploadError")
        )
        return
      }

      const response = await fetch(created.uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      })
      if (!response.ok) {
        setError(t("uploadError"))
        return
      }
      onChange(created.url)
    })
  }

  return (
    <AdminField label={label} hint={hint} className={className}>
      <div className="flex items-start gap-3">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
          {value ? (
            <Image
              src={value}
              alt=""
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <span className="flex h-full items-center justify-center text-muted-foreground">
              <ImageIcon className="size-6" />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <AdminInput
            value={value}
            dir="ltr"
            placeholder={t("imageUrl")}
            onChange={(event) => onChange(event.target.value)}
            className="text-start"
          />
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) upload(file)
                event.target.value = ""
              }}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={pending}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3.5 text-[13px] font-bold text-brand-plum transition hover:bg-muted disabled:opacity-50"
            >
              <Upload className="size-4" />
              {pending ? t("uploading") : t("upload")}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex h-9 items-center gap-1 rounded-full px-3 text-[13px] font-bold text-muted-foreground transition hover:text-destructive"
              >
                <X className="size-4" />
                {t("clear")}
              </button>
            )}
          </div>
          {error && (
            <p role="alert" className="text-[13px] font-bold text-destructive">
              {error}
            </p>
          )}
        </div>
      </div>
    </AdminField>
  )
}

export { ImageField }
