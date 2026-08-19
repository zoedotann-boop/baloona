"use client"

import { createContext, useContext, useId } from "react"

import { cn } from "@/lib/utils"

import { InfoTooltip } from "./info-tooltip"

/**
 * Small building blocks shared by every admin form.
 *
 * The admin uses the same brand tokens as the site (never ad-hoc colors) but a
 * denser, tool-like rhythm: small labels, tight cards, and inputs that read as
 * editable rather than decorative.
 *
 * `AdminField` mints the control's id and hands it to whichever `AdminInput` /
 * `AdminTextarea` / `AdminSelect` sits inside it, so every control is labelled
 * without each call site having to wire `htmlFor` by hand.
 */

const FieldIdContext = createContext<string | undefined>(undefined)

const controlClass =
  "w-full rounded-xl border border-border bg-white px-3.5 text-[15px] text-foreground transition placeholder:text-muted-foreground focus:border-primary focus:outline-none"

/** A section of the admin, matching one save action. */
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
      className={cn(
        "rounded-[22px] border border-border bg-white p-5",
        className
      )}
    >
      {title && (
        <div className="mb-4">
          <h2 className="font-heading text-[19px] font-black text-brand-plum">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-[14px] text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

/** Label + optional info tooltip around a control, which it also labels. */
function AdminField({
  label,
  tooltip,
  action,
  children,
  className,
}: {
  label: string
  /** Guidance shown on an info icon beside the label — "what goes here". */
  tooltip?: string
  /** Rendered on the label row, e.g. the "fill with AI" button. */
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

/**
 * Adopt the surrounding `AdminField`'s id — unless the control names itself.
 *
 * A control that carries its own `aria-label` is one of several inside a field
 * (a row of list lines, an opening-hours pair), so it must not also answer to
 * the field's single label id.
 */
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
      className={cn(controlClass, "h-11", className)}
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
      className={cn(controlClass, "h-11", className)}
      {...props}
    />
  )
}

/** On/off switch used for publish flags and visibility. */
function AdminToggle({
  checked,
  onChange,
  label,
  tooltip,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
  /** Guidance shown on an info icon beside the label — "what this does". */
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

/**
 * Compact on/off marker for a table cell.
 *
 * A row's toggles live in its dialog, so the table needs to say "is this live?"
 * in the width of a word rather than repeat the switch.
 */
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
