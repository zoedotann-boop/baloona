import type { Ref } from "react"

import { HONEYPOT_FIELD } from "@/lib/forms/honeypot"

interface HoneypotFieldProps {
  /** Read the value at submit time when the form doesn't use `FormData`. */
  ref?: Ref<HTMLInputElement>
}

/**
 * Hidden anti-spam field. Positioned off-screen and taken out of the tab order
 * and the accessibility tree, so a human never sees or fills it — a naive bot
 * that completes every input does. Paired with `isHoneypotFilled` on the
 * server. Rendered inside every public form.
 */
function HoneypotField({ ref }: HoneypotFieldProps) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-0 -left-[9999px] h-px w-px overflow-hidden opacity-0"
    >
      <input
        ref={ref}
        type="text"
        name={HONEYPOT_FIELD}
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  )
}

export { HoneypotField }
