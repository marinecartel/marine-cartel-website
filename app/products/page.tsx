import type { Metadata } from "next"
import { supabase } from "@/lib/supabase"
import ProductsFilterClient from "@/components/ProductsFilter"
import ProductsGrid from "@/components/ProductsGrid"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Industrial Automation Products | Marine Cartel",
  description: "Buy used, refurbished & new PLC, HMI, Drives & industrial automation parts. Worldwide shipping.",
}

type Props = {
  searchParams: Promise<{
    brand?: string
    category?: string
    condition?: string
    model_family?: string
    category_main?: string
    search?: string
    page?: string
  }>
}

// Helper function to fetch ALL unique values even if rows > 1000
async function getAllUniqueValues(columnName: string) {
  let allData: any[] = [];
  let errorOccurred = false;
  let rangeStart = 0;
  const rangeStep = 1000;

  // Yeh loop tab tak chalega jab tak humein saara data nahi mil jata
  while (true) {
    const { data, error } = await supabase
      .from("products")
      .select(columnName)
      .range(rangeStart, rangeStart + rangeStep - 1);

    if (error || !data || data.length === 0) break;

    allData = [...allData, ...data];
    if (data.length < rangeStep) break; // Iska matlab aur data nahi bacha
    rangeStart += rangeStep;
  }

  return [...new Set(allData.map(item => item[columnName]).filter(Boolean))].sort();
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams

  const page = parseInt(params?.page || "1")
  const limit = 32
  const from = (page - 1) * limit
  const to = from + limit - 1

  /* ---------------- FILTER VALUES (RECURSIVE FETCH) ---------------- */
  
  // Ab hum guarantee ke saath saara data uthayenge chahe 10,000 rows hon
  const [brands, categories, conditions, modelFamilies, categoryMainList] = await Promise.all([
    getAllUniqueValues("brand"),
    getAllUniqueValues("category"),
    getAllUniqueValues("condition"),
    getAllUniqueValues("model_family"),
    getAllUniqueValues("category_main"),
  ]);

  /* ---------------- PRODUCT QUERY (UNCHANGED) ---------------- */

  let query = supabase
    .from("products")
    .select("*", { count: "exact" })

  if (params?.brand?.trim()) {
    query = query.ilike("brand", `%${params.brand.trim()}%`)
  }

  if (params?.category?.trim()) {
    query = query.ilike("category", `%${params.category.trim()}%`)
  }

  if (params?.condition?.trim()) {
    query = query.ilike("condition", `%${params.condition.trim()}%`)
  }

  if (params?.model_family?.trim()) {
    query = query.ilike("model_family", `%${params.model_family.trim()}%`)
  }

  if (params?.category_main?.trim()) {
    query = query.ilike("category_main", `%${params.category_main.trim()}%`)
  }

  if (params?.search?.trim()) {
    const s = params.search.trim()
    query = query.or(`model.ilike.%${s}%,name.ilike.%${s}%,description.ilike.%${s}%,brand.ilike.%${s}%,technical_specs::text.ilike.%${s}%`)
  }

  const { data: products, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) console.error(error)

  const totalPages = Math.ceil((count || 0) / limit)

  if (page > totalPages && totalPages > 0) {
    const newParams = new URLSearchParams(params as any)
    newParams.set("page", "1")
    redirect(`/products?${newParams.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductsFilterClient
        brands={brands}
        categories={categories}
        model_family={modelFamilies}
        conditions={conditions}
        category_main={categoryMainList}
        currentParams={params}
      />

      <ProductsGrid
        products={products || []}
        totalCount={count || 0}
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  )
}