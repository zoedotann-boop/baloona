import { SiteFooter } from "@/components/home/site-footer"
import { SiteHeader } from "@/components/home/site-header"

import { PublicShell } from "./public-shell"

/**
 * Brand-global chrome for the pages with no branch in context — the branch
 * picker, the customer card and checkout without a source branch. It reuses the
 * shared header and footer in their slim mode (wordmark + language switcher on
 * top, wordmark + credit line below), so these pages share the same shell as
 * the branch pages without inventing venue links they can't provide.
 */
function BrandShell({ children }: { children: React.ReactNode }) {
  return (
    <PublicShell
      header={<SiteHeader />}
      footer={<SiteFooter year={new Date().getFullYear()} />}
    >
      {children}
    </PublicShell>
  )
}

export { BrandShell }
