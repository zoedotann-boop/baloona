import { ProductsForm } from "@/components/admin/forms/products-form"
import { requireLocationAccess } from "@/lib/admin/access"
import { toLocalized } from "@/lib/admin/drafts"
import { getShopSettings, listProducts } from "@/lib/db/queries/admin"
import { isPaymentConfigured } from "@/lib/shop/availability"

export default async function AdminShopPage({
  params,
}: PageProps<"/admin/[location]/shop">) {
  const { location: slug } = await params
  await requireLocationAccess(slug, "content")

  const [products, settings] = await Promise.all([
    listProducts(),
    getShopSettings(),
  ])

  return (
    <ProductsForm
      slug={slug}
      paymentConfigured={isPaymentConfigured()}
      initial={{
        isOpen: settings?.isOpen ?? false,
        products: products.map((product) => ({
          id: product.id,
          name: toLocalized(product.name),
          entries: product.entries,
          price: product.price,
          theme: product.theme,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
        })),
      }}
    />
  )
}
