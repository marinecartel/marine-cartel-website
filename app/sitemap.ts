import { supabase } from "@/lib/supabase"
import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "http://localhost:3000"

  const { data: products, error } = await supabase
    .from("products")
    .select("slug")

  if (error) {
    console.error("Sitemap error:", error)
    return []
  }

  const productUrls =
    products?.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })) || []

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...productUrls,
  ]
}
