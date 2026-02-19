import { supabase } from "@/lib/supabase"
import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Yeh line check karegi: Agar site Vercel par hai toh asli domain use karegi, 
  // nahi toh localhost use karegi (testing ke liye).
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? "https://marinecartel.store" 
    : "http://localhost:3000"

    /* ---------------- 1. FETCH ALL PRODUCTS (PAGINATION) ---------------- */
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
    if (data.length < rangeStep) break; // Agar 1000 se kam mile, matlab data khatam
    rangeStart += rangeStep;
  }

  /* ---------------- 2. HREFLANG LOGIC ---------------- */
    const languages = {
    'en-US': '', // USA
    'en-GB': '', // UK
    'en-AE': '', // UAE
    'en-DE': '', // Germany
    'en-CA': '', // Canada
    'en-AU': '', // Australia
    'en-SG': '', // Singapore
    'en-SA': '', // Saudi Arabia
    'en-NL': '', // Netherlands
    'en-FR': '', // France
    'en-IT': '', // Italy
    'en-JP': '', // Japan
    'en-KR': '', // South Korea
    'en-MX': '', // Mexico
    'en-IN': '', // India
    'x-default': '', // Global Default
  }

  // Helper function: Yeh function har URL ke liye hreflang links generate karega
  const getAlternates = (path: string) => {
    const fullUrl = `${baseUrl}${path}`;
    const alternates: Record<string, string> = {};
    Object.keys(languages).forEach((lang) => {
      alternates[lang] = fullUrl;
    });
    return alternates;
  };


  const { data: products, error } = await supabase
    .from("products")
    .select("slug")

  if (error) {
    console.error("Sitemap error:", error)
    return []
  }

  const productUrls = (allProducts as { slug: string; updated_at: string | null }[]).map((product) => ({
  url: `${baseUrl}/products/${product.slug}`,
  // Ab TS ko pata hai ki updated_at exist karta hai
  lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
  changeFrequency: "weekly" as const,
  priority: 0.8,
  alternates: {
    languages: getAlternates(`/products/${product.slug}`),
  },
}));
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: getAlternates(''),
      },
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: getAlternates('/products'),
      },
    },
    ...productUrls,
  ]
}
