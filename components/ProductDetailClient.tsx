"use client"

import { useState, useRef } from "react"

type Product = {
  id: string
  name: string
  brand: string
  model: string
  condition: string
  price: number
  images: string[]
  description: string
  slug?: string
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
  const whatsappMessage = encodeURIComponent(
`Hello Marine Cartel,

I am interested in:

Product: ${product.name}
Brand: ${product.brand}
Model: ${product.model}
Condition: ${product.condition}
Quantity: ${qty}
Price: ₹ ${product.price}

Product Link: ${productUrl}

Please share best price, availability & shipping details.`
  )

  /* ---------------- SHARE LINKS ---------------- */
  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(product.name + " - " + productUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${productUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${productUrl}`,
  }

  const copyLink = () => {
    navigator.clipboard.writeText(productUrl)
    alert("Product link copied!")
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* TITLE */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-4 py-1 bg-black text-white text-sm rounded-full">{product.brand}</span>
            <span className={`px-4 py-1 text-sm rounded-full font-medium ${
              product.condition === "New"
                ? "bg-green-100 text-green-700"
                : product.condition === "Used"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-blue-100 text-blue-700"
            }`}>{product.condition}</span>
            <span className="px-4 py-1 text-sm font-semibold bg-gray-800 text-white rounded-full">{product.model}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* LEFT - IMAGE GALLERY */}
          {/* LEFT - IMAGE GALLERY */}
<div>
  <div
    onWheel={handleWheel}
    onTouchStart={handleTouchStart}
    onTouchEnd={handleTouchEnd}
    className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer select-none relative flex items-center justify-center"
    style={{ height: '500px' }}
  >
    {selectedImage && (
      <img
        src={selectedImage}
        alt={product.name}
        className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-105"
      />
    )}
  </div>

  {/* Thumbnails */}
  <div className="flex gap-4 mt-4 overflow-x-auto py-2">
    {images.map((img, index) => (
      <img
        key={index}
        src={img}
        alt={`thumbnail-${index}`}
        onClick={() => setCurrentIndex(index)}
        className={`w-24 h-24 flex-shrink-0 object-cover rounded-lg cursor-pointer border-2 transition ${
          currentIndex === index ? "border-black" : "border-gray-200"
        }`}
      />
    ))}
  </div>
</div>


          {/* RIGHT - INFO */}
          <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">

            {/* PRICE & QTY */}
            <div>
              <p className="text-3xl font-bold text-gray-900">₹ {product.price}</p>
              <p className="text-sm text-gray-600 mt-1">Worldwide Shipping • Bulk Discount Available</p>
              <div className="flex items-center gap-3 mt-3">
                <span>Qty:</span>
                <button onClick={decreaseQty} className="w-10 h-10 rounded-lg bg-gray-200 text-xl">−</button>
                <span className="text-lg font-semibold">{qty}</span>
                <button onClick={increaseQty} className="w-10 h-10 rounded-lg bg-gray-200 text-xl">+</button>
              </div>
            </div>

            {/* 👇 MINI SPEC TABLE YAHAN ADD KARO */}
<div className="mt-4 bg-gray-50 border rounded-xl p-4">
  <div className="space-y-3 text-sm">

    <div className="flex items-center">
      <span className="w-28 text-gray-500 font-medium">
        Model No.
      </span>
      <span className="font-bold text-gray-900 break-all">
        {product.model}
      </span>
    </div>

    <div className="flex items-center">
      <span className="w-28 text-gray-500 font-medium">
        Brand
      </span>
      <span className="text-gray-900 font-semibold">
        {product.brand}
      </span>
    </div>

    <div className="flex items-center">
      <span className="w-28 text-gray-500 font-medium">
        Condition
      </span>
      <span
        className={`px-3 py-1 text-xs rounded-full font-semibold ${
          product.condition === "New"
            ? "bg-green-100 text-green-700"
            : product.condition === "Used"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        {product.condition}
      </span>
    </div>

  </div>
</div>


            {/* WhatsApp CTA */}
            <div className="flex flex-col gap-3">
              <a
                href={`https://wa.me/917405558403?text=${whatsappMessage}`}
                target="_blank"
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold shadow text-center transition"
              >
                Get Best Price on WhatsApp
              </a>

              {/* Share Buttons */}
              <div className="flex gap-3 flex-wrap mt-4">
                <a href={shareLinks.whatsapp} target="_blank" className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">WhatsApp</a>
                <a href={shareLinks.facebook} target="_blank" className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">Facebook</a>
                <a href={shareLinks.linkedin} target="_blank" className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">LinkedIn</a>
                <button onClick={copyLink} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium">Copy Link</button>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <h3 className="text-xl font-bold mb-3">Product Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

          </div>
        </div>
      </div>

      {/* JSON-LD STRUCTURED DATA */}
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
            sku: product.model,
            offers: {
              "@type": "Offer",
              availability: "https://schema.org/InStock",
              priceCurrency: "INR",
              price: product.price,
            },
          }),
        }}
      />
    </div>
  )
}
