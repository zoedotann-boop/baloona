import { BirthdayCta } from "@/components/home/birthday-cta"
import { Features } from "@/components/home/features"
import { Gallery } from "@/components/home/gallery"
import { Hero } from "@/components/home/hero"
import { MenuTeaser } from "@/components/home/menu-teaser"
import { Pricing } from "@/components/home/pricing"
import { Reassurance } from "@/components/home/reassurance"
import { Reviews } from "@/components/home/reviews"
import { VisionPanel } from "@/components/home/vision-panel"

export default function Page() {
  return (
    <>
      <Hero />
      <VisionPanel />
      <Features />
      <Reassurance />
      <Pricing />
      <MenuTeaser />
      <BirthdayCta />
      <Gallery />
      <Reviews />
    </>
  )
}
