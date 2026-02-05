import type { Metadata } from "next"
import { supabase } from "@/lib/supabase"
import ProductsFilterClient from "@/components/ProductsFilter"
import ProductsGrid from "@/components/ProductsGrid"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Industrial Automation Products | Marine Cartel",
  description:
    "Buy used, refurbished & new PLC, HMI, Drives & industrial automation parts. Worldwide shipping.",
}

type Props = {
  searchParams: Promise<{
    brand?: string
    category?: string
    condition?: string
    search?: string
  }>
}

export default async function ProductsPage({ searchParams }: Props) {

  // ✅ VERY IMPORTANT (Next 16 requirement)
  const params = await searchParams

  /* ---------------- FILTER VALUES ---------------- */

  const { data: brandsData } = await supabase.from("products").select("brand")
  const { data: categoryData } = await supabase.from("products").select("category")
  const { data: conditionData } = await supabase.from("products").select("condition")

  const brands = [...new Set(brandsData?.map((b: any) => b.brand).filter(Boolean))]
  const categories = [...new Set(categoryData?.map((c: any) => c.category).filter(Boolean))]
  const conditions = [...new Set(conditionData?.map((c: any) => c.condition).filter(Boolean))]

  /* ---------------- PRODUCT QUERY ---------------- */

  let query = supabase.from("products").select("*")

  if (params?.brand?.trim()) {
    query = query.ilike("brand", `%${params.brand.trim()}%`)
  }

  if (params?.category?.trim()) {
    query = query.ilike("category", `%${params.category.trim()}%`)
  }

  if (params?.condition?.trim()) {
    query = query.ilike("condition", `%${params.condition.trim()}%`)
  }

  if (params?.search?.trim()) {
    const s = params.search.trim()
    query = query.or(
      `model.ilike.%${s}%,name.ilike.%${s}%,description.ilike.%${s}%,brand.ilike.%${s}%`
    )
  }

  const { data: products } = await query.order("id", { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50">

      <ProductsFilterClient
        brands={brands}
        categories={categories}
        conditions={conditions}
        currentParams={params}
      />

      <ProductsGrid products={products || []} />

    </div>
  )
}
