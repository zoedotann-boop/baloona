interface PublicShellProps {
  header: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
}

function PublicShell({ header, footer, children }: PublicShellProps) {
  return (
    <div className="flex min-h-svh flex-col overflow-x-clip bg-background">
      {header}
      <main className="flex-1">{children}</main>
      {footer}
    </div>
  )
}

export { PublicShell }
