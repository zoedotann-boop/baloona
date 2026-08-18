import { SiteChrome } from "@/components/layout/site-chrome"

/**
 * Chrome for one branch. The full shell — header, contact block, footer,
 * announcement and analytics — lives in {@link SiteChrome}, shared with every
 * other public page so the whole site wears one shell.
 */
export default async function LocationLayout({
  params,
  children,
}: LayoutProps<"/[location]">) {
  const { location: slug } = await params
  return <SiteChrome slug={slug}>{children}</SiteChrome>
}
