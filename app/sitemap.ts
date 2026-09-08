import { supabase } from "@/lib/supabase"
import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://themarinecartel.com"

  /* ---------------- 1. FETCH ALL AUTOMATION PRODUCTS ---------------- */
  let allProducts: { slug: string; updated_at: string | null }[] = []
  let rangeStart = 0
  const rangeStep = 1000

  while (true) {
    const { data, error } = await supabase
      .from("products")
      .select("slug, updated_at")
      .range(rangeStart, rangeStart + rangeStep - 1)

    if (error || !data || data.length === 0) break
    allProducts = [...allProducts, ...data]
    if (data.length < rangeStep) break
    rangeStart += rangeStep
  }

  /* ---------------- 2. FETCH ALL MARINE DATA ---------------- */
  const { data: marineBrands } = await supabase.from("marine_brands").select("slug")
  const { data: marineCategories } = await supabase.from("marine_categories").select("slug")

  const { data: marineModels } = await supabase
    .from("marine_models")
    .select("slug, updated_at, marine_brands(slug)")

  const { data: marineSpares } = await supabase
    .from("marine_spares")
    .select(`
      slug, 
      updated_at, 
      marine_models(
        slug, 
        marine_brands(slug)
      )
    `)

  /* ---------------- 3. HREFLANG LOGIC ---------------- */
  const languages = {
    'en-US': '', 'en-GB': '', 'en-AE': '', 'en-DE': '', 'en-CA': '',
    'en-AU': '', 'en-SG': '', 'en-SA': '', 'en-NL': '', 'en-FR': '',
    'en-IT': '', 'en-JP': '', 'en-KR': '', 'en-MX': '', 'en-IN': '',
    'x-default': '',
  }

  const getAlternates = (path: string) => {
    const fullUrl = `${baseUrl}${path}`
    const alternates: Record<string, string> = {}
    Object.keys(languages).forEach((lang) => {
      alternates[lang] = fullUrl
    })
    return alternates
  }

  /* ---------------- 4. GENERATE URLS (Safe Mapping) ---------------- */
  const productUrls = allProducts
    .filter((p) => Boolean(p.slug))
    .map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: { languages: getAlternates(`/products/${product.slug}`) },
    }))

  const brandUrls = (marineBrands || [])
    .filter((b) => Boolean(b.slug))
    .map((b) => ({
      url: `${baseUrl}/marine-spares/${b.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
      alternates: { languages: getAlternates(`/marine-spares/${b.slug}`) },
    }))

  const categoryUrls = (marineCategories || [])
    .filter((c) => Boolean(c.slug))
    .map((c) => ({
      url: `${baseUrl}/marine-spares/category/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
      alternates: { languages: getAlternates(`/marine-spares/category/${c.slug}`) },
    }))

  const modelUrls = (marineModels || [])
    .filter((m: any) => Boolean(m?.slug && m?.marine_brands?.slug))
    .map((m: any) => ({
      url: `${baseUrl}/marine-spares/${m.marine_brands.slug}/${m.slug}`,
      lastModified: m.updated_at ? new Date(m.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: { languages: getAlternates(`/marine-spares/${m.marine_brands.slug}/${m.slug}`) },
    }))

  const sparePartUrls = (marineSpares || [])
    .filter((s: any) => Boolean(s?.slug && s?.marine_models?.slug && s?.marine_models?.marine_brands?.slug))
    .map((s: any) => ({
      url: `${baseUrl}/marine-spares/${s.marine_models.marine_brands.slug}/${s.marine_models.slug}/${s.slug}`,
      lastModified: s.updated_at ? new Date(s.updated_at) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
      alternates: { languages: getAlternates(`/marine-spares/${s.marine_models.marine_brands.slug}/${s.marine_models.slug}/${s.slug}`) },
    }))

  /* ---------------- 5. FINAL ASSEMBLY ---------------- */
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages: getAlternates('') },
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages: getAlternates('/products') },
    },
    {
      url: `${baseUrl}/marine-spares`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages: getAlternates('/marine-spares') },
    },
    ...productUrls,
    ...brandUrls,
    ...categoryUrls,
    ...modelUrls,
    ...sparePartUrls,
  ]
}