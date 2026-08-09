/**
 * Payment seam — the single place the PayMe integration will be wired in.
 *
 * We are building the storefront ahead of PayMe approving the account, so this
 * is a deliberate placeholder: it persists nothing and starts no real payment.
 * When PayMe is live, replace the body with the call that creates a sale and
 * returns its hosted-checkout URL, then have the checkout redirect there.
 */

export interface CheckoutOrder {
  productId: string
  fullName: string
  phone: string
  email: string
}

export interface PaymentResult {
  /** `"placeholder"` until the real PayMe flow is connected. */
  status: "placeholder"
}

/** Placeholder for the PayMe redirect/API. Does nothing yet, saves nothing. */
export async function startPayment(
  order: CheckoutOrder
): Promise<PaymentResult> {
  // TODO(payme): create a PayMe sale for `order` and return its checkout URL.
  void order
  return { status: "placeholder" }
}
