/**
 * Shared styling for the hand-written public form fields (contact, checkout), so
 * every text input across the site reads the same — one source of truth instead
 * of a per-form copy. LTR fields (phone/email) add `text-right` + `dir="ltr"`; a
 * textarea adds `h-auto resize-none py-3`. Colours and focus ring come from the
 * design tokens (`border-border`, `text-foreground`, `focus:border-primary`).
 */
export const fieldInputClass =
  "w-full h-12 rounded-xl bg-white border border-border px-4 text-[16px] text-foreground placeholder:text-muted-foreground focus:bg-white focus:border-primary focus:outline-none transition"

/** Inline, RTL-friendly validation message shown under a field. */
export function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p role="alert" className="mt-1.5 text-[13px] font-bold text-destructive">
      {message}
    </p>
  )
}
