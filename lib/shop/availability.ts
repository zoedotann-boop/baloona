import "server-only"

import { paymeConfig } from "@/lib/env"
import { PUNCH_CARD_SHOP_ENABLED } from "@/lib/features"

export function isShopOpen(): boolean {
  return PUNCH_CARD_SHOP_ENABLED && paymeConfig() !== null
}
