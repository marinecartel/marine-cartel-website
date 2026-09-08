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
      title: "Product Not Found",
    }
  }

  const title = `${product.brand} ${product.model} ${product.condition} | Worldwide Shipping | Best Price`

  const description = `Get the best deal on ${product.brand} ${product.model} (${product.condition}). We supply genuine New, Used, Refurbished, Surplus industrial automation worldwide. Fast shipping to PAN India, USA, Europe, UAE & Asia. 100% Tested. Request a quote now!`

  return {
    title,
    description,
    alternates: {
      canonical: `https://themarinecartel.com/products/${product.slug}`,
    },
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
      url: `https://themarinecartel.com/products/${product.slug}`,
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

  // ✅ All Condition Types Logic for Google Schema
  const cond = product.condition?.toLowerCase() || ""
  let itemCondition = "https://schema.org/UsedCondition"

  if (cond.includes("new")) {
    itemCondition = "https://schema.org/NewCondition"
  } else if (cond.includes("refurbished")) {
    itemCondition = "https://schema.org/RefurbishedCondition"
  } else if (cond.includes("part")) {
    itemCondition = "https://schema.org/DamagedCondition"
  } else {
    // Covers: Pre-owned, Used Working, Used Untested, etc.
    itemCondition = "https://schema.org/UsedCondition"
  }

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
    offers: {
      "@type": "Offer",
      url: `https://themarinecartel.com/products/${product.slug}`,
      priceCurrency: "USD",
      price: product.price,
      availability: "https://schema.org/InStock",
      itemCondition: itemCondition,
      seller: {
        "@type": "Organization",
        name: "Marine Cartel",
      },
    },
    "additionalProperty": product.technical_specs 
      ? Object.entries(product.technical_specs).map(([key, value]) => ({
          "@type": "PropertyValue",
          "name": key,
          "value": value
        }))
      : []
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