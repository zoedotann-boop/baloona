import type { Ref } from "react"

import { HONEYPOT_FIELD } from "@/lib/forms/honeypot"

interface HoneypotFieldProps {
  ref?: Ref<HTMLInputElement>
}

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
        readOnly
        onFocus={(event) => event.currentTarget.removeAttribute("readonly")}
        data-1p-ignore
        data-lpignore="true"
        data-bwignore="true"
        data-form-type="other"
      />
    </div>
  )
}

export { HoneypotField }
