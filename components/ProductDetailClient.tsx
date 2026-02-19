"use client"

import { useState, useRef } from "react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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
  technical_specs?: Record<string, any> | null
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
    <div className="bg-[#fcfcfd] min-h-screen font-sans antialiased text-slate-900 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Navigation / Breadcrumb */}
        <nav className="flex items-center gap-2 mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
          <span className="hover:text-[#0F766E] cursor-pointer">{product.category}</span> 
          <span className="text-slate-300">/</span> 
          <span>{product.brand}</span> 
          <span className="text-slate-300">/</span> 
          <span className="text-[#0F766E]">{product.model}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: GALLERY */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-4 w-full max-w-full overflow-hidden">
            <div 
              onWheel={handleWheel}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative bg-white rounded-[1.5rem] border border-slate-200/60 shadow-sm overflow-hidden flex items-center justify-center aspect-square md:aspect-[4/3] lg:aspect-[4/3] xl:aspect-[16/11] w-full"
             >
              {selectedImage && (
                <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
              )}
              
              <div className="absolute top-6 left-6 flex gap-2">
                <span className="px-4 py-1.5 bg-[#0F766E] text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-teal-100">{product.model}</span>
                <span className="px-4 py-1.5 bg-white border border-slate-100 text-slate-900 text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm">{product.condition}</span>
              </div>

              {images.length > 1 && (
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                  <button onClick={prevImage} className="pointer-events-auto w-11 h-11 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-slate-400 hover:text-[#0F766E] transition-all border border-slate-100">←</button>
                  <button onClick={nextImage} className="pointer-events-auto w-11 h-11 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-slate-400 hover:text-[#0F766E] transition-all border border-slate-100">→</button>
                </div>
              )}
            </div>

            {/* Thumbnails - FIXED FOR MOBILE & CUSTOM SCROLLBAR */}
            <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar-teal w-full max-w-full">
              {images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentIndex(i)} 
                  className={`w-16 h-16 rounded-2xl border-2 transition-all overflow-hidden flex-shrink-0 ${currentIndex === i ? 'border-[#0F766E] ring-4 ring-teal-50' : 'border-slate-100 opacity-60 hover:opacity-100'}`}
                >
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
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                    Order on WhatsApp
                </a>
                
                <div className="flex gap-2">
                  
                  <button onClick={copyLink} className="px-5 py-4 bg-slate-50 text-slate-400 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Spec Table */}
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

        </div>

<div className="lg:col-span-6 xl:col-span-7 space-y-4 w-full max-w-full overflow-hidden">
            {/* Description Summary */}
            <div className="px-2">
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                <span className="w-6 h-[2px] bg-[#0F766E]"></span>
                Description
              </h3>
              <div className="markdown-container text-slate-600 text-sm font-medium leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {product.description || ""}
                  </ReactMarkdown>
                </div>
              
            </div>

          </div>
        <div className="lg:col-span-6 xl:col-span-5 space-y-6">
          {/* NAYA: Technical Specifications Table (JSONB Data) */}
            {product.technical_specs && Object.keys(product.technical_specs).length > 0 && (
              <div className="bg-white rounded-[1.5rem] border border-slate-200/80 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Technical Specifications
                  </h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {Object.entries(product.technical_specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center px-6 py-3.5 hover:bg-slate-50 transition-colors">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{key}</span>
                      <span className="text-[12px] font-black text-slate-900">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>

          
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar-teal::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar-teal::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
          
        }
        .custom-scrollbar-teal::-webkit-scrollbar-thumb {
          background: #0F766E;
          border-radius: 10px;
          
        }
        .custom-scrollbar-teal::-webkit-scrollbar-thumb:hover {
          background: #0D9488;
        }

        .markdown-container table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }
        .markdown-container th {
          background: #f8fafc;
          text-align: left;
          padding: 12px 16px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          border-bottom: 2px solid #e2e8f0;
        }
        .markdown-container td {
          padding: 12px 16px;
          border-bottom: 1px solid #f1f5f9;
          color: #1e293b;
        }
        .markdown-container tr:last-child td {
          border-bottom: none;
        }
        .markdown-container ul {
          list-style: disc;
          padding-left: 20px;
          margin: 10px 0;
        }
        .markdown-container h3 {
          color: #0F766E;
          margin-top: 20px;
          font-weight: bold;
        }

        @media (max-width: 768px) {
           .custom-scrollbar-teal::-webkit-scrollbar {
              display: none; /* Mobile par scrollbar chupa di taaki clean dikhe, par scrolling kaam karegi */
           }
              .markdown-container { overflow-x: auto; }
        }
           
      `}</style>

      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "image": images.length > 0 ? images : ["https://marinecartel.com/default-placeholder.jpg"], // Fallback image
      "description": product.description?.substring(0, 160), // Short clean description
      "brand": { "@type": "Brand", "name": product.brand },
      "model": product.model,
      "sku": product.model,
      "mpn": product.model,
      "condition": product.condition === "New" ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
      "offers": {
        "@type": "Offer",
        "url": productUrl,
        "priceCurrency": "USD",
        "price": product.price || "0",
        "priceValidUntil": "2030-12-31", // Logical expiry for Google
        "availability": "https://schema.org/InStock",
        "itemCondition": product.condition === "New" ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "USD" },
          "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "US" },
          "deliveryTime": {
            "@type": "ShippingDeliveryTime",
            "handlingTime": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": 3, "unitCode": "d" },
            "transitTime": { "@type": "QuantitativeValue", "minValue": 5, "maxValue": 15, "unitCode": "d" }
          }
        }
      }
    }),
  }}
/>
    </div>
  )
}