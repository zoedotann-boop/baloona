import { cn } from "@/lib/utils"

import { InfoTooltip } from "./info-tooltip"

type AdminTableHeader =
  string | { label: string; className?: string; tooltip?: string }

export const adminCell = "px-3 py-1.5 align-middle"

function AdminTable({
  headers,
  children,
  className,
}: {
  headers: AdminTableHeader[]
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-2xl border border-border",
        className
      )}
    >
      <table className="w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-border bg-muted/60">
            {headers.map((header, index) => {
              const {
                label,
                className: cell,
                tooltip,
              } = typeof header === "string" ? { label: header } : header
              return (
                <th
                  key={`${label}-${index}`}
                  className={cn(
                    "px-3 py-1.5 text-start text-[12px] font-black text-muted-foreground uppercase",
                    cell
                  )}
                >
                  <span className="inline-flex items-center gap-1">
                    {label}
                    {tooltip && <InfoTooltip text={tooltip} />}
                  </span>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

function AdminTableRow({ children }: { children: React.ReactNode }) {
  return (
    <tr className="border-b border-border transition last:border-0 hover:bg-muted/30">
      {children}
    </tr>
  )
}

function AdminTableEmpty({
  colSpan,
  label,
}: {
  colSpan: number
  label: string
}) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-3 py-10 text-center text-muted-foreground"
      >
        {label}
      </td>
    </tr>
  )
}

export { AdminTable, AdminTableEmpty, AdminTableRow }
