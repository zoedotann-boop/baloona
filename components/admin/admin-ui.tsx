"use client"

import { createContext, useContext, useId } from "react"

import { cn } from "@/lib/utils"

import { InfoTooltip } from "./info-tooltip"

const FieldIdContext = createContext<string | undefined>(undefined)

const controlClass =
  "w-full rounded-xl border border-border bg-white px-3.5 text-[15px] text-foreground transition placeholder:text-muted-foreground focus:border-primary focus:outline-none"

function AdminCard({
  title,
  description,
  children,
  className,
}: {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn("rounded-2xl border border-border bg-white p-4", className)}
    >
      {title && (
        <div className="mb-3">
          <h2 className="font-heading text-[16px] font-black text-brand-plum">
            {title}
          </h2>
          {description && (
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

function AdminField({
  label,
  tooltip,
  action,
  children,
  className,
}: {
  label: string
  tooltip?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  const id = useId()

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5">
          <label htmlFor={id} className="text-[13px] font-bold text-brand-plum">
            {label}
          </label>
          {tooltip && <InfoTooltip text={tooltip} />}
        </span>
        {action}
      </div>
      <FieldIdContext.Provider value={id}>{children}</FieldIdContext.Provider>
    </div>
  )
}

function useControlId(ownId?: string, ariaLabel?: string): string | undefined {
  const fieldId = useContext(FieldIdContext)
  if (ownId) return ownId
  return ariaLabel ? undefined : fieldId
}

function AdminInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      id={useControlId(props.id, props["aria-label"])}
      className={cn(controlClass, "h-10", className)}
      {...props}
    />
  )
}

function AdminTextarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      id={useControlId(props.id, props["aria-label"])}
      className={cn(controlClass, "resize-y py-2.5 leading-relaxed", className)}
      {...props}
    />
  )
}

function AdminSelect({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      id={useControlId(props.id, props["aria-label"])}
      className={cn(controlClass, "h-10", className)}
      {...props}
    />
  )
}

function AdminToggle({
  checked,
  onChange,
  label,
  tooltip,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
  tooltip?: string
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="flex items-center gap-2.5 text-[14px] font-bold text-brand-plum"
      >
        <span
          className={cn(
            "relative h-6 w-11 shrink-0 rounded-full transition",
            checked ? "bg-primary" : "bg-muted"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 size-5 rounded-full bg-white transition-all",
              checked ? "start-[22px]" : "start-0.5"
            )}
          />
        </span>
        {label}
      </button>
      {tooltip && <InfoTooltip text={tooltip} />}
    </span>
  )
}

function AdminFlag({ on, label }: { on: boolean; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[12px] font-bold whitespace-nowrap",
        on
          ? "bg-brand-green/15 text-brand-green"
          : "bg-muted text-muted-foreground"
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          on ? "bg-brand-green" : "bg-muted-foreground/50"
        )}
      />
      {label}
    </span>
  )
}

export {
  AdminCard,
  AdminField,
  AdminFlag,
  AdminInput,
  AdminSelect,
  AdminTextarea,
  AdminToggle,
}
