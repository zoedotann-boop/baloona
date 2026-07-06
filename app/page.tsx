import { CloudDivider } from "@/components/brand/cloud-divider"
import { BirthdayCta } from "@/components/home/birthday-cta"
import { ContactSection } from "@/components/home/contact-section"
import { Features } from "@/components/home/features"
import { Gallery } from "@/components/home/gallery"
import { Hero } from "@/components/home/hero"
import { MenuTeaser } from "@/components/home/menu-teaser"
import { Pricing } from "@/components/home/pricing"
import { Reviews } from "@/components/home/reviews"

export default function Page() {
  return (
    <>
      <Hero />
      <CloudDivider />
      <Features />
      <Pricing />
      <MenuTeaser />
      <BirthdayCta />
      <Gallery />
      <Reviews />
      <ContactSection />
    </>
  )
}
