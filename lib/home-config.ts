// Petal colors for the three feature icons, in order (lavender, rose, mint).
export const FEATURE_COLORS = ["#b39ddb", "#dda99e", "#a7e8d0"]

export interface FeatureContent {
  title: string
  description: string
}

interface PriceRow {
  label: string
  price: string
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
