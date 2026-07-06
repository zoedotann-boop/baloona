import type { PriceRow } from "@/components/brand/price-card"

// Petal colors for the four feature icons, in order (pink, blue, yellow, green).
export const FEATURE_COLORS = ["#f587bc", "#88bedc", "#f6c744", "#5e9e54"]

export interface FeatureContent {
  title: string
  description: string
}

export interface PriceContent {
  sub: string
  title: string
  featured: boolean
  rows: PriceRow[]
}

export interface ReviewContent {
  text: string
  name: string
  init: string
  ago: string
}
