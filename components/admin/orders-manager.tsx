"use client"

import { Eye, RefreshCw, Undo2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useState, useTransition } from "react"

import { AdminModal } from "@/components/admin/admin-modal"
import {
  adminCell,
  AdminTable,
  AdminTableEmpty,
  AdminTableRow,
} from "@/components/admin/admin-table"
import { ConfirmModal } from "@/components/admin/confirm-modal"
import { useToast } from "@/components/admin/toast"
import { recheckOrder, refundPunchCardOrder } from "@/lib/actions/admin/orders"
import type { ShopOrderStatus } from "@/lib/db/schema/shop"
import type { OrderView } from "@/lib/shop/order-view"
import { cn } from "@/lib/utils"

const STATUSES: ShopOrderStatus[] = [
  "paid",
  "pending",
  "expired",
  "refunded",
  "failed",
]

const STATUS_TONE: Record<ShopOrderStatus, string> = {
  paid: "bg-brand-mint text-brand-plum",
  pending: "bg-brand-banana text-brand-plum",
  expired: "bg-muted text-muted-foreground",
  refunded: "bg-muted text-brand-plum",
  failed: "bg-destructive/10 text-destructive",
}

const ALL = "all"

function OrdersManager({
  slug,
  orders,
}: {
  slug: string
  orders: OrderView[]
}) {
  const t = useTranslations("admin.orders")
  const common = useTranslations("admin.common")
  const toast = useToast()
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<ShopOrderStatus | "all">(ALL)
  const [branchFilter, setBranchFilter] = useState(ALL)
  const [openOrder, setOpenOrder] = useState<string | null>(null)
  const [refunding, setRefunding] = useState<string | null>(null)
  const [pending, start] = useTransition()

  const branches = [
    ...new Set(orders.map((order) => order.branchName ?? "")),
  ].sort()

  const visible = orders.filter(
    (order) =>
      (statusFilter === ALL || order.status === statusFilter) &&
      (branchFilter === ALL || (order.branchName ?? "") === branchFilter)
  )

  const statusLabel = (status: ShopOrderStatus) =>
    ({
      paid: t("statusPaid"),
      pending: t("statusPending"),
      expired: t("statusExpired"),
      refunded: t("statusRefunded"),
      failed: t("statusFailed"),
    })[status]

  function recheck(orderId: string) {
    start(async () => {
      const result = await recheckOrder({ slug, orderId })
      if (!result.ok) {
        toast(t("recheckError"), "error")
        return
      }
      toast(
        result.status === "pending"
          ? t("recheckPending")
          : t("recheckDone", { status: statusLabel(result.status) }),
        result.status === "pending" ? "error" : "success"
      )
      router.refresh()
    })
  }

  function refund(orderId: string) {
    start(async () => {
      const result = await refundPunchCardOrder({ slug, orderId })
      if (result.ok) {
        toast(t("refundDone"))
      } else if (result.error === "cardUsed") {
        toast(t("refundCardUsed"), "error")
      } else if (result.error === "unknown") {
        toast(t("refundUnknown"), "error")
      } else if (result.error === "rejected") {
        toast(t("refundRejected"), "error")
      } else {
        toast(t("refundNotRefundable"), "error")
      }
      router.refresh()
    })
  }

  return (
    <div className="pb-10">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <div className="min-w-0">
          <h1 className="font-heading text-[24px] font-black text-brand-plum">
            {t("title")}
          </h1>
          <p className="mt-0.5 text-[14px] text-muted-foreground">
            {t("description")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {([ALL, ...STATUSES] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setStatusFilter(option)}
              aria-pressed={statusFilter === option}
              className={cn(
                "h-9 rounded-full px-4 text-[14px] font-bold transition",
                statusFilter === option
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:brightness-95"
              )}
            >
              {option === ALL ? t("filterAll") : statusLabel(option)}
            </button>
          ))}
          <select
            value={branchFilter}
            onChange={(event) => setBranchFilter(event.target.value)}
            aria-label={t("branchFilter")}
            className="h-9 rounded-xl border border-border bg-white px-2.5 text-[13px] font-bold text-brand-plum focus:border-primary focus:outline-none"
          >
            <option value={ALL}>{t("allBranches")}</option>
            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch || t("noBranch")}
              </option>
            ))}
          </select>
        </div>
      </header>

      <AdminTable
        headers={[
          { label: t("createdAt"), className: "w-32" },
          t("name"),
          { label: t("phone"), className: "w-36" },
          { label: t("package"), tooltip: t("packageTip") },
          { label: t("amount"), className: "w-24" },
          { label: t("branch"), tooltip: t("branchTip") },
          { label: t("status"), className: "w-32", tooltip: t("statusTip") },
          { label: common("actions"), className: "w-px sr-only" },
        ]}
      >
        {visible.length === 0 && (
          <AdminTableEmpty colSpan={8} label={t("empty")} />
        )}

        {visible.map((order) => (
          <AdminTableRow key={order.id}>
            <td
              className={cn(
                adminCell,
                "w-32 whitespace-nowrap text-muted-foreground"
              )}
            >
              {order.createdAt}
            </td>
            <td className={adminCell}>
              <span className="font-bold text-brand-plum">
                {order.fullName || "—"}
              </span>
            </td>
            <td className={cn(adminCell, "w-36")}>
              <span
                dir="ltr"
                className="block text-start text-muted-foreground"
              >
                {order.phone}
              </span>
            </td>
            <td className={adminCell}>
              {order.productName || t("entries", { count: order.entries })}
            </td>
            <td className={cn(adminCell, "w-24 whitespace-nowrap")}>
              {order.amount}
            </td>
            <td className={cn(adminCell, "text-muted-foreground")}>
              {order.branchName ?? t("noBranch")}
            </td>
            <td className={cn(adminCell, "w-32")}>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[12px] font-black whitespace-nowrap",
                  STATUS_TONE[order.status]
                )}
              >
                {statusLabel(order.status)}
              </span>
            </td>
            <td className="px-2 py-1.5">
              <div className="flex items-center justify-end gap-0.5">
                <RowAction
                  label={t("view")}
                  onClick={() => setOpenOrder(order.id)}
                >
                  <Eye className="size-4" />
                </RowAction>
                {order.canRecheck && (
                  <RowAction
                    label={t("recheck")}
                    disabled={pending}
                    onClick={() => recheck(order.id)}
                  >
                    <RefreshCw className="size-4" />
                  </RowAction>
                )}
                {order.canRefund && (
                  <RowAction
                    label={t("refund")}
                    disabled={pending}
                    danger
                    onClick={() => setRefunding(order.id)}
                  >
                    <Undo2 className="size-4" />
                  </RowAction>
                )}
              </div>

              <ConfirmModal
                open={refunding === order.id}
                onClose={() => setRefunding(null)}
                onConfirm={() => refund(order.id)}
                title={t("refund")}
                message={t("refundConfirm", {
                  amount: order.amount,
                  name: order.fullName,
                })}
                confirmLabel={t("refund")}
              />

              <AdminModal
                open={openOrder === order.id}
                onClose={() => setOpenOrder(null)}
                title={order.fullName || t("title")}
              >
                <OrderDetails order={order} statusLabel={statusLabel} />
              </AdminModal>
            </td>
          </AdminTableRow>
        ))}
      </AdminTable>
    </div>
  )
}

function OrderDetails({
  order,
  statusLabel,
}: {
  order: OrderView
  statusLabel: (status: ShopOrderStatus) => string
}) {
  const t = useTranslations("admin.orders")
  const emailDiffers =
    order.customerEmail !== null &&
    order.email !== "" &&
    order.customerEmail.toLowerCase() !== order.email.toLowerCase()

  return (
    <>
      <dl className="grid gap-x-6 gap-y-1.5 text-[15px] sm:grid-cols-2">
        <Detail label={t("status")} value={statusLabel(order.status)} />
        <Detail label={t("createdAt")} value={order.createdAt} />
        <Detail label={t("paidAt")} value={order.paidAt} />
        <Detail label={t("refundedAt")} value={order.refundedAt} />
        <Detail label={t("phone")} value={order.phone} dir="ltr" />
        <Detail label={t("email")} value={order.email} dir="ltr" />
        <Detail
          label={t("package")}
          value={`${order.productName} · ${t("entries", { count: order.entries })}`}
        />
        <Detail label={t("amount")} value={order.amount} />
        <Detail label={t("branch")} value={order.branchName} />
        <Detail label={t("saleId")} value={order.saleId} dir="ltr" />
      </dl>

      {emailDiffers && (
        <p className="rounded-2xl bg-brand-banana p-3 text-[14px] text-brand-plum">
          {t("emailMismatch", { email: order.customerEmail ?? "" })}
        </p>
      )}

      {order.cardUsed && (
        <p className="text-[13px] text-muted-foreground">
          {t("refundCardUsed")}
        </p>
      )}

      {order.cardPath && (
        <a
          href={order.cardPath}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-[14px] font-bold text-primary underline"
        >
          {t("openCard")}
        </a>
      )}
    </>
  )
}

function RowAction({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  danger?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "flex size-8 items-center justify-center rounded-lg transition disabled:opacity-30",
        danger
          ? "text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          : "text-brand-plum hover:bg-white"
      )}
    >
      {children}
    </button>
  )
}

function Detail({
  label,
  value,
  dir,
}: {
  label: string
  value: string | null
  dir?: "ltr"
}) {
  if (!value) return null
  return (
    <div className="flex gap-2">
      <dt className="shrink-0 font-bold text-muted-foreground">{label}</dt>
      <dd dir={dir} className={cn("text-foreground", dir && "text-start")}>
        {value}
      </dd>
    </div>
  )
}

export { OrdersManager }
