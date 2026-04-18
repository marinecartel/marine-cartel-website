"use client";
import React, { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { ArrowLeft, Ship, Settings2, ArrowRight, Search, Filter, Anchor } from "lucide-react";

export default function CategoryModelsPage({ params }: { params: any }) {
  const [unwrappedParams, setUnwrappedParams] = useState<any>(null);
  const [models, setModels] = useState<any[]>([]);
  const [filteredModels, setFilteredModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    params.then((res: any) => setUnwrappedParams(res));
  }, [params]);

  useEffect(() => {
    const fetchModels = async () => {
      if (!unwrappedParams) return;

      // FETCH MODELS instead of spares
      const { data, error } = await supabase
        .from("marine_models")
        .select(`
          *,
          marine_brands!inner (
            name,
            slug
          ),
          marine_categories!inner (
            name,
            slug
          )
        `)
        .eq("marine_categories.slug", unwrappedParams.categorySlug);

      if (data) {
        setModels(data);
        setFilteredModels(data);
      }
      setLoading(false);
    };

    fetchModels();
  }, [unwrappedParams]);

  // Search & Filter Logic for Models
  useEffect(() => {
    let result = models;

    if (selectedBrand !== "All") {
      result = result.filter(m => m.marine_brands.name === selectedBrand);
    }

    if (searchTerm) {
      result = result.filter(m => 
        m.model_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.marine_brands.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredModels(result);
  }, [searchTerm, selectedBrand, models]);

  const categoryName = models?.[0]?.marine_categories?.name || "Category";
  const uniqueBrands = Array.from(new Set(models.map(m => m.marine_brands.name)));

  if (loading) return <div className="pt-40 text-center font-black uppercase text-slate-400 animate-pulse">Scanning Fleet...</div>;

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-12">
          <Link href="/marine-spares" className="inline-flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#14B8A6] mb-6 transition-all">
            <ArrowLeft size={14} className="mr-2" /> Back to Inventory
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-8 bg-[#14B8A6]"></div>
            <span className="text-[10px] font-black text-[#14B8A6] uppercase tracking-[0.4em]">Available Models</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-[#0B2E2B] uppercase tracking-tighter leading-tight mb-8">
            {categoryName} <span className="text-slate-300 block md:inline">Series</span>
          </h1>

          {/* Search & Brand Filter Bar */}
          <div className="grid md:grid-cols-4 gap-4 bg-white p-4 rounded-[2rem] border shadow-sm">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="text"
                placeholder="Search Engine Model (e.g. 6EY18L, K98MC)"
                className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#14B8A6]/20 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <select 
                className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-2xl font-black text-[10px] uppercase outline-none appearance-none cursor-pointer"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <option value="All">All Brands</option>
                {uniqueBrands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="flex items-center justify-center bg-[#0B2E2B] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest px-4">
              {filteredModels.length} Models Found
            </div>
          </div>
        </div>

        {/* Models Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredModels.length > 0 ? (
            filteredModels.map((model) => (
              <Link 
                key={model.id} 
                href={`/marine-spares/${model.marine_brands.slug}/${model.slug}`}
                className="group bg-white p-8 rounded-[3rem] border border-slate-100 hover:border-[#14B8A6]/20 transition-all shadow-sm hover:shadow-2xl overflow-hidden relative flex flex-col justify-between min-h-[320px]"
              >
                {/* Background Decor */}
                <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-10 transition-opacity rotate-12">
                    <Anchor size={200} />
                </div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-10">
                    <div className="px-4 py-2 bg-teal-50 text-[#14B8A6] rounded-full text-[9px] font-black uppercase tracking-widest">
                      {model.marine_brands.name}
                    </div>
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-[#14B8A6] group-hover:text-white transition-all shadow-inner">
                      <Ship size={20} />
                    </div>
                  </div>

                  <h3 className="text-3xl font-black text-[#0B2E2B] uppercase leading-tight mb-2">
                    {model.model_name}
                  </h3>
                  
                  <div className="flex gap-4">
                    {model.bore && (
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Bore</span>
                        <span className="text-xs font-black text-slate-700">{model.bore} mm</span>
                      </div>
                    )}
                    {model.stroke && (
                      <div className="flex flex-col border-l border-slate-100 pl-4">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Stroke</span>
                        <span className="text-xs font-black text-slate-700">{model.stroke} mm</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative z-10 pt-8 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#14B8A6] uppercase tracking-widest">Explore Spares</span>
                  <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white group-hover:translate-x-2 transition-transform">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-dashed">
              <Settings2 size={60} className="mx-auto text-slate-100 mb-6" />
              <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">No matching models in our stock.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}