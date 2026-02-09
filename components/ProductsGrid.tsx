import Link from "next/link"

const WhatsAppIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

type Product = {
  id: string
  name: string
  brand: string
  model: string
  model_family: string
  condition: string
  price: number | null
  price_type?: string | null
  images: string[]
  slug: string
  description?: string
}

type Props = {
  products: Product[]
}

export default function ProductsGrid({ products }: Props) {
  const displayProducts = products && products.length > 0 ? products : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-teal-50/10">
      {/* Updated Header with Teal accents */}
      <div className="mb-10 flex items-center gap-3">
        <span className="h-px flex-grow bg-slate-200"></span>
        <span className="text-[11px] font-black text-[#0F766E] uppercase tracking-[0.2em] whitespace-nowrap bg-white px-4 py-1 rounded-full border border-teal-100 shadow-sm">
          Showing {displayProducts.length} Products
        </span>
        <span className="h-px flex-grow bg-slate-200"></span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
        {displayProducts.map((p) => {
          const whatsappText = encodeURIComponent(
            `Hello Marine Cartel,\n\nI am interested in:\n\nProduct: ${p.name}\nModel: ${p.model}\nCondition: ${p.condition}\n\nPlease share price & availability.`
          );

          // Updated condition styles to match theme
          const conditionStyles: Record<string, string> = {
            New: "bg-[#0F766E] text-white shadow-teal-100",
            Used: "bg-amber-500 text-white shadow-amber-100",
            Refurbished: "bg-[#14B8A6] text-white shadow-teal-100",
          };

          return (
            <div
              key={p.id}
              className="group flex flex-col bg-white rounded-[1.5rem] border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(15,118,110,0.18)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
            >
              {/* Image Section */}
              <div className="relative aspect-[4/3] m-2.5 overflow-hidden rounded-[0.5rem] bg-slate-50">
                <a href={`/products/${p.slug}`} className="block w-full h-full">
                  <img
                    src={p.images?.[0] || "/placeholder.png"}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </a>
                
                {/* Condition Badge */}
                <div className="absolute top-1 left-1">
                  <span className={`px-2.5 py-1 text-[8px] font-black uppercase tracking-wider rounded-full shadow-md ${conditionStyles[p.condition] || 'bg-slate-500 text-white'}`}>
                    {p.condition}
                  </span>
                </div>

                {/* Model Badge */}
                <div className="absolute bottom-1.5 left-3 right-3">
                  <div className="bg-white/85 backdrop-blur-md px-3 py-2 rounded-lg border border-white/20 shadow-lg">
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">Model No</p>
                    <p className="text-xs font-black text-[#0B2E2B] truncate tracking-tight">{p.model}</p>
                  </div>
                </div>
              </div>

              {/* Info Section */}
              <div className="flex flex-col flex-grow px-5 pb-6 pt-1">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <span className="text-[9px] font-black text-[#0F766E] uppercase tracking-widest shrink-0">
                    {p.brand}
                  </span>
                  <span className="w-0.5 h-0.5 rounded-full bg-slate-300 shrink-0"></span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider truncate">
                    {p.model_family || "Series"}
                  </span>
                </div>

                <a href={`/products/${p.slug}`} className="block">
                  <h3 className="text-[15px] font-bold text-slate-900 leading-[1.3] line-clamp-2 min-h-[2.5rem] group-hover:text-[#0F766E] transition-colors duration-300">
                    {p.name}
                  </h3>
                </a>

                <div className="h-px w-full bg-slate-100/80 my-4"></div>

                <div className="mt-auto">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                        Price
                      </span>
                      {p.price_type === "fixed" && p.price ? (
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-[10px] font-bold text-slate-900">$</span>
                          <span className="text-xl font-black text-[#0B2E2B] tracking-tighter">
                            {p.price.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[9px] font-black text-[#0F766E] bg-teal-50 px-2 py-1 rounded-lg border border-teal-100 uppercase whitespace-nowrap">
                          On Request
                        </span>
                      )}
                    </div>
                    
                    <a
                      href={`https://wa.me/917405558403?text=${whatsappText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-12 h-12 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-2xl transition-all active:scale-90 shadow-[0_8px_20px_-4px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_24px_-4px_rgba(37,211,102,0.5)] group-hover:rotate-6"
                    >
                      <WhatsAppIcon />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}