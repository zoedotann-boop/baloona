import { SiteChrome } from "@/components/layout/site-chrome"

export default async function LocationLayout({
  params,
  children,
}: LayoutProps<"/[location]">) {
  const { location: slug } = await params
  return <SiteChrome slug={slug}>{children}</SiteChrome>
}
