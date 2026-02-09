"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

type FilterProps = {
  brands: string[]
  categories: string[]
  conditions: string[]
  model_family: string[]
  category_main: string[]
  currentParams: {
    brand?: string
    category?: string
    condition?: string
    model_family?: string
    category_main?: string
    search?: string
  }
}

export default function ProductsFilterClient({
  brands = [],
  categories = [],
  conditions = [],
  model_family = [],
  category_main = [],
  currentParams,
}: FilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [search, setSearch] = useState(currentParams.search || "")

  /* ---------------- UPDATE FILTER (UNCHANGED) ---------------- */
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) params.set(key, value)
    else params.delete(key)

    router.push(`/products?${params.toString()}`)
  }

  /* ---------------- DEBOUNCED SEARCH (UNCHANGED) ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())

      if (search) params.set("search", search)
      else params.delete("search")

      router.push(`/products?${params.toString()}`)
    }, 400)

    return () => clearTimeout(timer)
  }, [search])

  const activeFiltersCount = Object.entries(currentParams).filter(
    ([key, value]) => key !== "search" && value
  ).length

  const clearFilters = () => {
    router.push("/products")
  }

  return (
    <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 py-4">

        {/* ================= TOP STRIP ================= */}
        <div className="flex items-center gap-3 mb-4">

          {/* SEARCH - Updated Focus to Teal */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <input
              type="text"
              placeholder="Search assets, brand, model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-100/60 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-teal-400 rounded-2xl text-sm font-medium outline-none ring-4 ring-transparent focus:ring-teal-50 transition-all shadow-inner"
            />
          </div>

          {/* FILTER BUTTON - Updated to Deep Teal */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              filtersOpen || activeFiltersCount > 0
                ? "bg-[#0F766E] text-white shadow-lg shadow-teal-100"
                : "bg-white border border-slate-200 text-slate-600 hover:border-teal-200 shadow-sm"
            }`}
          >
            Filter {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""}
          </button>

          {/* RESET */}
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-[10px] font-bold text-slate-400 hover:text-rose-500 uppercase tracking-wider transition-colors"
            >
              Reset
            </button>
          )}

        </div>

        {/* ================= COLLAPSIBLE FILTER GRID ================= */}
        <div
          className={`overflow-hidden transition-all duration-500 ${
            filtersOpen ? "max-h-[600px] opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-teal-50/30 rounded-[2rem] p-6 border border-teal-100/50 shadow-inner grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">

            <FilterSelect
              label="Brand"
              value={currentParams.brand}
              options={brands}
              onChange={(v) => updateFilter("brand", v)}
            />

            <FilterSelect
              label="Category"
              value={currentParams.category}
              options={categories}
              onChange={(v) => updateFilter("category", v)}
            />

            <FilterSelect
              label="Model Family"
              value={currentParams.model_family}
              options={model_family}
              onChange={(v) => updateFilter("model_family", v)}
            />

            <FilterSelect
              label="Condition"
              value={currentParams.condition}
              options={conditions}
              onChange={(v) => updateFilter("condition", v)}
            />

            <FilterSelect
              label="Main Category"
              value={currentParams.category_main}
              options={category_main}
              onChange={(v) => updateFilter("category_main", v)}
            />

          </div>
        </div>

      </div>
    </div>
  )
}

/* ================= REUSABLE SELECT - Updated with Teal Accents ================= */

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value?: string
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-2">
      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
        {label}
      </label>

      <div className="relative group">
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none w-full bg-white border border-slate-200 text-slate-700 py-3.5 pl-5 pr-10 rounded-2xl text-xs font-bold cursor-pointer transition-all hover:border-teal-400 focus:ring-4 focus:ring-teal-50 outline-none shadow-sm"
        >
          <option value="">All {label}s</option>
          {options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 group-hover:text-[#0F766E] transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}