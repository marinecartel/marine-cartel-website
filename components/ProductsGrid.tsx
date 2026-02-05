import Link from "next/link"

type Product = {
  id: string
  name: string
  brand: string
  model: string
  condition: string
  price: number
  images: string[]
  slug: string
  description?: string
}

type Props = {
  products: Product[]
}

export default function ProductsGrid({ products }: Props) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">📦</div>
        <h3 className="text-2xl font-semibold text-gray-800">No Products Found</h3>
        <p className="text-gray-600 mt-2">Try adjusting filters or search term.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 text-gray-600">
        Showing <span className="font-semibold">{products.length}</span> Products
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((p) => {
          const whatsappText = encodeURIComponent(
            `Hello Marine Cartel,\n\nI am interested in:\n\nProduct: ${p.name}\nModel: ${p.model}\nCondition: ${p.condition}\n\nPlease share best price & availability.`
          )

          return (
            <div
              key={p.id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border overflow-hidden"
            >
              <Link href={`/products/${p.slug}`}>
                <div className="relative bg-gray-100 h-56 flex items-center justify-center overflow-hidden">
                  <img
                    src={p.images?.[0]}
                    alt={p.name}
                    className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className={`absolute top-2 left-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                    p.condition === "New" ? "bg-green-100 text-green-700"
                    : p.condition === "Used" ? "bg-yellow-100 text-yellow-700"
                    : "bg-blue-100 text-blue-700"
                  }`}>{p.condition}</span>
                  <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-semibold bg-black text-white rounded-full">
                    {p.model}
                  </span>
                </div>
              </Link>

              <div className="p-4 space-y-2">
                <Link href={`/products/${p.slug}`}>
                  <h2 className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-black">{p.name}</h2>
                </Link>

                <div className="space-y-2">

  {/* MODEL BADGE - Premium Style */}
  <div>
    <span className="inline-block px-4 py-2 text-base font-bold tracking-wide 
bg-black text-white rounded-lg shadow-md">
  {p.model}
</span>

  </div>

  {/* Brand */}
  <div className="text-sm font-medium text-gray-600">
    {p.brand}
  </div>

</div>


                <div className="flex items-center justify-between pt-2">
                  <p className="font-bold text-gray-900">₹ {p.price}</p>
                  <a
                    href={`https://wa.me/917405558403?text=${whatsappText}`}
                    target="_blank"
                    className="text-sm px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
