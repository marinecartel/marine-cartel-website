"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

type FilterProps = {
  brands: string[]
  categories: string[]
  conditions: string[]
  currentParams: {
    brand?: string
    category?: string
    condition?: string
    search?: string
  }
  onSearchChange?: (value: string) => void
  onFilterChange?: (filters: { brand: string; category: string; condition: string }) => void
}


export default function ProductsFilterClient({
  brands,
  categories,
  conditions,
  currentParams,
  onSearchChange,
  onFilterChange,

}: FilterProps) {

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearchChange) onSearchChange(e.target.value)
  }

  // filters select
  const handleFilter = (key: string, value: string) => {
    if (!onFilterChange) return
    const newFilters = { 
      brand: currentParams.brand || "",
      category: currentParams.category || "",
      condition: currentParams.condition || "",
      [key]: value
    }
    onFilterChange(newFilters)
  }
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)

  const [searchText, setSearchText] = useState(currentParams.search || "")
  const [brand, setBrand] = useState(currentParams.brand || "")
  const [category, setCategory] = useState(currentParams.category || "")
  const [condition, setCondition] = useState(currentParams.condition || "")

  // Debounce search typing
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilter("search", searchText)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchText])

  useEffect(() => {
    updateFilter("brand", brand)
  }, [brand])
  useEffect(() => {
    updateFilter("category", category)
  }, [category])
  useEffect(() => {
    updateFilter("condition", condition)
  }, [condition])

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="sticky top-0 z-20 bg-gray-50 border-b shadow-sm px-4 py-2">

      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Search by name, model, brand, title, description..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="w-full p-2 rounded-lg border mb-2 text-sm"
      />

      {/* COLLAPSE TOGGLE */}
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-semibold text-gray-700">Filters</span>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="text-gray-500 text-lg transform transition-transform"
        >
          {filtersOpen ? "▲" : "▼"}
        </button>
      </div>

      {/* COLLAPSIBLE FILTERS */}
      <div className={`overflow-hidden transition-all duration-300 ${filtersOpen ? "max-h-60" : "max-h-0"}`}>
        <div className="grid grid-cols-3 gap-2 mb-2 text-sm">

          {/* Brand */}
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">All Brands</option>
            {brands.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Condition */}
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">All Conditions</option>
            {conditions.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
    </div>
  )
}
