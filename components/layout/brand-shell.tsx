import { SiteFooter } from "@/components/home/site-footer"
import { SiteHeader } from "@/components/home/site-header"

import { PublicShell } from "./public-shell"

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
