import { CloudDivider } from "@/components/brand/cloud-divider"
import { BirthdayCta } from "@/components/home/birthday-cta"
import { Features } from "@/components/home/features"
import { Hero } from "@/components/home/hero"
import { Pricing } from "@/components/home/pricing"
import { Reviews } from "@/components/home/reviews"
import { SiteFooter } from "@/components/home/site-footer"
import { SiteHeader } from "@/components/home/site-header"

export default function Page() {
  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <CloudDivider />
        <Features />
        <Pricing />
        <BirthdayCta />
        <Reviews />
      </main>
      <SiteFooter />
    </div>
  )
}
