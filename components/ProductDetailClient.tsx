"use client"

import { useState, useRef } from "react"

type Product = {
  id: string
  name: string
  brand: string
  model: string
  condition: string
  category: string
  category_main: string
  price: number | null
  price_type?: string | null
  model_family?: string | null
  warranty?: string | null
  images: string[]
  slug: string
  description?: string
}

export default function ProductDetailClient({
  product,
}: {
  product: Product
}) {
  const images = Array.isArray(product.images) ? product.images : []
  const [currentIndex, setCurrentIndex] = useState(0)
  const [qty, setQty] = useState(1)
  const touchStartX = useRef<number | null>(null)
  const selectedImage = images[currentIndex]

  const productUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://marinecartel.com/products/${product.slug}`

  /* ---------------- IMAGE NAVIGATION ---------------- */
  const nextImage = () => setCurrentIndex(prev => prev === images.length - 1 ? 0 : prev + 1)
  const prevImage = () => setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1)

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY > 0) nextImage()
    else prevImage()
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartX.current) return
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    if (deltaX > 50) prevImage()
    if (deltaX < -50) nextImage()
    touchStartX.current = null
  }

  /* ---------------- QTY LOGIC ---------------- */
  const increaseQty = () => setQty(prev => prev + 1)
  const decreaseQty = () => setQty(prev => (prev > 1 ? prev - 1 : 1))

  /* ---------------- WHATSAPP MESSAGE ---------------- */
  const whatsappMessage = 
`Hello Marine Cartel,

I am interested in:

Product: ${product.name || ""}
Brand: ${product.brand || ""}
Model: ${product.model || ""}
Condition: ${product.condition || ""}
Quantity: ${qty}
Price: ${
  product.price_type === "fixed" && product.price
    ? `$ ${product.price}`
    : "Price on Request"
}

Product Link: ${productUrl}

Please share best price, availability & shipping details.`
  
const whatsappUrl = `https://wa.me/917405558403?text=${encodeURIComponent(whatsappMessage)}`

  const copyLink = () => {
    navigator.clipboard.writeText(productUrl)
  }

  return (
    <div className="bg-[#fcfcfd] min-h-screen font-sans antialiased text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Navigation / Breadcrumb - Updated to Teal */}
        <nav className="flex items-center gap-2 mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
          <span className="hover:text-[#0F766E] cursor-pointer">{product.category}</span> 
          <span className="text-slate-300">/</span> 
          <span>{product.brand}</span> 
          <span className="text-slate-300">/</span> 
          <span className="text-[#0F766E]">{product.model}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: GALLERY */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-4">
            <div 
              onWheel={handleWheel}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden flex items-center justify-center aspect-square md:aspect-[4/3] lg:aspect-[4/3] xl:aspect-[16/11]"
            >
              {selectedImage && (
                <img src={selectedImage} alt={product.name} className="max-h-[85%] max-w-[85%] object-contain" />
              )}
              
              <div className="absolute top-6 left-6 flex gap-2">
                <span className="px-4 py-1.5 bg-[#0F766E] text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-teal-100">Verified Asset</span>
                <span className="px-4 py-1.5 bg-white border border-slate-100 text-slate-900 text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm">Original</span>
              </div>

              {images.length > 1 && (
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                  <button onClick={prevImage} className="pointer-events-auto w-11 h-11 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-slate-400 hover:text-[#0F766E] transition-all border border-slate-100">←</button>
                  <button onClick={nextImage} className="pointer-events-auto w-11 h-11 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-slate-400 hover:text-[#0F766E] transition-all border border-slate-100">→</button>
                </div>
              )}
            </div>

            {/* Thumbnails - Updated to Teal Ring */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setCurrentIndex(i)} className={`w-16 h-16 rounded-2xl border-2 transition-all overflow-hidden flex-shrink-0 ${currentIndex === i ? 'border-[#0F766E] ring-4 ring-teal-50' : 'border-slate-100 opacity-60 hover:opacity-100'}`}>
                  <img src={img} className="w-full h-full object-cover" alt="thumb" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: ESSENTIAL INFO */}
          <div className="lg:col-span-6 xl:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                 <span className="text-[10px] font-black text-[#0F766E] bg-teal-50 px-3 py-1 rounded-lg uppercase tracking-widest">{product.brand}</span>
                 <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                 <span className={`text-[10px] font-black uppercase tracking-widest ${product.condition === "New" ? "text-emerald-600" : "text-amber-600"}`}>{product.condition}</span>
              </div>
              <h1 className="text-3xl xl:text-4xl font-black text-slate-900 tracking-tight leading-[1.15]">
                {product.name}
              </h1>
            </div>

            {/* Pricing Card */}
            <div className="bg-white rounded-[1.5rem] border border-slate-200/80 p-6 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Price</p>
                  <div className="flex items-baseline gap-1">
                    {product.price_type === "fixed" && product.price ? (
                      <>
                        <span className="text-4xl font-black text-slate-900 tracking-tighter">${product.price.toLocaleString()}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Negotiable</span>
                      </>
                    ) : (
                      <span className="text-2xl font-black text-[#0F766E] tracking-tight">Price on Request</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                  <button onClick={decreaseQty} className="w-10 h-10 rounded-lg bg-white shadow-sm border border-slate-200 font-bold text-slate-400 hover:text-[#0F766E] active:scale-90 transition-all">−</button>
                  <span className="w-6 text-center font-bold text-sm text-slate-700">{qty}</span>
                  <button onClick={increaseQty} className="w-10 h-10 rounded-lg bg-white shadow-sm border border-slate-200 font-bold text-slate-400 hover:text-[#0F766E] active:scale-90 transition-all">+</button>
                </div>
              </div>

              <div> 
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Worldwide Shipping</p>
              </div>
                  
              <div className="flex flex-col gap-3">
                <a 
                  href={whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 py-4 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-teal-100/50 transition-all hover:-translate-y-0.5"
                >
                    Order on WhatsApp
                </a>
                <div className="flex gap-2">
                  <button className="flex-1 py-4 bg-slate-900 hover:bg-[#0F766E] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all">
                      Order Now
                  </button>
                  <button onClick={copyLink} className="px-5 py-4 bg-slate-50 text-slate-400 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Spec Table - Teal & Slate Dark Mode */}
            <div className="bg-slate-800 rounded-[1.5rem] p-6 text-white shadow-xl shadow-slate-200/50 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#14B8A6]/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
               <div className="grid grid-cols-2 gap-y-5 gap-x-8 relative z-10">
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">Model No.</p>
                    <p className="text-sm font-bold text-teal-100 break-all">{product.model}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">Warranty</p>
                    <p className="text-sm font-bold text-white">{product.warranty || "N/A"}</p>
                  </div>
                
                <div className="col-span-2 border-t border-white/10 pt-4">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">Condition</p>
                    <p className="text-sm font-bold text-white leading-tight">{product.condition || "Marine Series"}</p>
                  </div>
               </div>
            </div>

            {/* Description Summary - Teal Accents */}
            <div className="px-2">
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                <span className="w-6 h-[2px] bg-[#0F766E]"></span>
                Description
              </h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                {product.description}
              </p>
            </div>

          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.name,
            image: images,
            description: product.description,
            brand: { "@type": "Brand", name: product.brand },
            mpn: product.model,
            sku: product.model,
            condition: product.condition,
            "itemCondition": product.condition === "New" 
        ? "https://schema.org/NewCondition" 
        : "https://schema.org/UsedCondition",

            offers: {
              "@type": "Offer",
              availability: "https://schema.org/InStock",
              priceCurrency: "USD",
              price: product.price,
              
            },
          }),
        }}
      />
    </div>
  )
}