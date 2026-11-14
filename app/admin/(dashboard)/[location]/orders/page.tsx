import { getLocale } from "next-intl/server"

import { OrdersManager } from "@/components/admin/orders-manager"
import { type Locale } from "@/i18n/routing"
import { requireLocationAccess } from "@/lib/admin/access"
import { listPunchCardOrders } from "@/lib/db/queries/admin"
import { formatDateTime, formatPrice, pickLocale } from "@/lib/localized"
import { refundBlocker, shouldQueryPayMe } from "@/lib/shop/order-lifecycle"

export default async function AdminOrdersPage({
  params,
}: PageProps<"/admin/[location]/orders">) {
  const { location: slug } = await params
  await requireLocationAccess(slug, "payments")

  const [orders, locale] = await Promise.all([
    listPunchCardOrders(),
    getLocale() as Promise<Locale>,
  ])

  return (
    <OrdersManager
      slug={slug}
      orders={orders.map((order) => {
        const blocker = refundBlocker(order, order.card)
        return {
          id: order.id,
          status: order.status,
          createdAt: formatDateTime(order.createdAt, locale),
          paidAt: order.paidAt ? formatDateTime(order.paidAt, locale) : null,
          refundedAt: order.refundedAt
            ? formatDateTime(order.refundedAt, locale)
            : null,
          fullName: order.fullName,
          phone: order.phone,
          email: order.email,
          customerEmail: order.card?.customer.email ?? null,
          productName: order.product
            ? pickLocale(order.product.name, locale)
            : "",
          entries: order.entries,
          amount: formatPrice(order.amount, locale),
          branchName: order.fromLocation
            ? pickLocale(order.fromLocation.name, locale)
            : null,
          saleId: order.paymeSaleId,
          cardPath: order.card ? `/card/${order.card.token}` : null,
          canRecheck:
            Boolean(order.paymeSaleId) && shouldQueryPayMe(order.status),
          canRefund: blocker === null,
          cardUsed: blocker === "cardUsed",
        }
      })}
    />
  )
}
