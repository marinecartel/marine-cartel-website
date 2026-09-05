import { supabase } from "@/lib/supabase"
import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? "https://themarinecartel.com" 
    : "http://localhost:3000"

  /* ---------------- 1. FETCH ALL AUTOMATION PRODUCTS (Existing) ---------------- */
  let allProducts: { slug: string, updated_at: string | null }[] = [];
  let rangeStart = 0;
  const rangeStep = 1000;

  while (true) {
    const { data, error } = await supabase
      .from("products")
      .select("slug, updated_at")
      .range(rangeStart, rangeStart + rangeStep - 1);

    if (error || !data || data.length === 0) break;
    allProducts = [...allProducts, ...data];
    if (data.length < rangeStep) break;
    rangeStart += rangeStep;
  }

  /* ---------------- 2. FETCH ALL MARINE DATA (New) ---------------- */
  
  // A. Marine Brands & Categories
  const { data: marineBrands } = await supabase.from("marine_brands").select("slug");
  const { data: marineCategories } = await supabase.from("marine_categories").select("slug");

  // B. Marine Models
  const { data: marineModels } = await supabase
    .from("marine_models")
    .select("slug, updated_at, marine_brands(slug)");

  // C. Deep Marine Spares (Brand > Model > Spare)
  const { data: marineSpares } = await supabase
    .from("marine_spares")
    .select(`
      slug, 
      updated_at, 
      marine_models(
        slug, 
        marine_brands(slug)
      )
    `);

  /* ---------------- 3. HREFLANG LOGIC (Original) ---------------- */
  const languages = {
    'en-US': '', 'en-GB': '', 'en-AE': '', 'en-DE': '', 'en-CA': '',
    'en-AU': '', 'en-SG': '', 'en-SA': '', 'en-NL': '', 'en-FR': '',
    'en-IT': '', 'en-JP': '', 'en-KR': '', 'en-MX': '', 'en-IN': '',
    'x-default': '',
  }

  const getAlternates = (path: string) => {
    const fullUrl = `${baseUrl}${path}`;
    const alternates: Record<string, string> = {};
    Object.keys(languages).forEach((lang) => {
      alternates[lang] = fullUrl;
    });
    return alternates;
  };

  /* ---------------- 4. GENERATE URLS ---------------- */

  // 1. Existing Automation Products
  const productUrls = allProducts.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
    alternates: { languages: getAlternates(`/products/${product.slug}`) },
  }));

  // 2. NEW: Marine Brands
  const brandUrls = (marineBrands || []).map((b) => ({
    url: `${baseUrl}/marine-spares/${b.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
    alternates: { languages: getAlternates(`/marine-spares/${b.slug}`) },
  }));

  // 3. NEW: Marine Categories
  const categoryUrls = (marineCategories || []).map((c) => ({
    url: `${baseUrl}/marine-spares/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
    alternates: { languages: getAlternates(`/marine-spares/category/${c.slug}`) },
  }));

  // 4. NEW: Marine Engine Models
  const modelUrls = (marineModels || []).map((m: any) => ({
    url: `${baseUrl}/marine-spares/${m.marine_brands.slug}/${m.slug}`,
    lastModified: m.updated_at ? new Date(m.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
    alternates: { languages: getAlternates(`/marine-spares/${m.marine_brands.slug}/${m.slug}`) },
  }));

  // 5. NEW: Deep Spare Parts (The core inventory)
  const sparePartUrls = (marineSpares || []).map((s: any) => ({
    url: `${baseUrl}/marine-spares/${s.marine_models.marine_brands.slug}/${s.marine_models.slug}/${s.slug}`,
    lastModified: s.updated_at ? new Date(s.updated_at) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
    alternates: { languages: getAlternates(`/marine-spares/${s.marine_models.marine_brands.slug}/${s.marine_models.slug}/${s.slug}`) },
  }));

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
      url: `${baseUrl}/marine-spares`, // Naya Marine Main Page
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