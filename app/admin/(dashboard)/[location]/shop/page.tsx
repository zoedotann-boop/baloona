import { ProductsForm } from "@/components/admin/forms/products-form"
import { requireLocationAccess } from "@/lib/admin/access"
import { toLocalized } from "@/lib/admin/drafts"
import { listProducts } from "@/lib/db/queries/admin"

export default async function AdminShopPage({
  params,
}: PageProps<"/admin/[location]/shop">) {
  const { location: slug } = await params
  await requireLocationAccess(slug)

  // The catalog is brand-global; the branch in the URL is only the auth context.
  const products = await listProducts()

  return (
    <ProductsForm
      slug={slug}
      initial={{
        products: products.map((product) => ({
          id: product.id,
          name: toLocalized(product.name),
          entries: product.entries,
          price: product.price,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
        })),
      }}
    />
  )
}
