interface PublicShellProps {
  /** Top bar — the shared `SiteHeader`, in full or brand-global mode. */
  header: React.ReactNode
  /** Everything below `<main>`: contact block + footer, or a slim footer. */
  footer?: React.ReactNode
  children: React.ReactNode
}

/**
 * The frame every public page shares: a full-height column with the header
 * pinned on top, the page in a growing `<main>`, and the footer beneath. The
 * two composition wrappers — `SiteChrome` (per-branch) and `BrandShell`
 * (brand-global) — fill the slots; overlays like the announcement modal and
 * analytics render as siblings of this shell.
 */
function PublicShell({ header, footer, children }: PublicShellProps) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      {header}
      <main className="flex-1">{children}</main>
      {footer}
    </div>
  )
}

export { PublicShell }
