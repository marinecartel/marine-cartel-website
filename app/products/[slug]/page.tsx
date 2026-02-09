import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import ProductDetailClient from "@/components/ProductDetailClient"

export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ slug: string }>
}

// ✅ Dynamic SEO Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!product) {
    return {
      title: "Product Not Found | Marine Cartel",
    }
  }

  const title = `${product.brand} ${product.model} ${product.condition} | Worldwide Shipping | Marine Cartel`

  const description = `Get the best deal on ${product.brand} ${product.model} (${product.condition}). 
We supply genuine New, Used, Refubrished, Surplus industrial automation worldwide. 
Fast shipping to PAN India, USA, Europe, UAE & Asia. 100% Tested. Request a quote now!
`

  return {
    title,
    description,
    keywords: [
      `${product.brand} ${product.model}`,
      `Buy ${product.model} online`,
      `${product.condition} ${product.brand} PLC`,
      `Refurbished industrial automation parts`,
      "Surplus automation dealer USA",
      "Bulk PLC supplier worldwide"
    ],
    openGraph: {
      title,
      description,
      images: product.images?.length ? [product.images[0]] : [],
    },
  }
}


// ✅ PAGE COMPONENT
export default async function ProductPage({ params }: Props) {
  const { slug } = await params

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!product) return notFound()

  // ✅ JSON-LD Structured Data
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.images?.length ? product.images : [],
    description: product.description,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    sku: product.model,
    mpn: product.model,
    condition: product.condition,
    offers: {
      "@type": "Offer",
      url: `https://marinecartel.com/products/${product.slug}`,
      priceCurrency: "USD",
      price: product.price,
      availability: "https://schema.org/InStock",
      itemCondition:
        product.condition === "Used"
          ? "https://schema.org/UsedCondition"
          : "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Marine Cartel",
      },
    },
  }

  return (
    <>
      {/* ✅ Structured Data for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <ProductDetailClient product={product} />
    </>
  )
}

