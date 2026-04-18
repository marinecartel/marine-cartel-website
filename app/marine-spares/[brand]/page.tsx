import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Anchor, ArrowRight, LayoutGrid } from "lucide-react";

export default async function BrandPage(props: { params: Promise<{ brand: string }> }) {
  const { brand } = await props.params;

  // Database call
  const { data: models } = await supabase
    .from('marine_models')
    .select('*, marine_brands!inner(name, slug)')
    .eq('marine_brands.slug', brand);

  if (!models || models.length === 0) {
    return (
      <div className="pt-40 text-center uppercase font-black text-slate-400">
        No models found for this brand in Alang Inventory.
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 border-b border-slate-200 pb-10">
          <nav className="flex gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
            <Link href="/marine-spares" className="hover:text-[#14B8A6] transition-colors">Inventory</Link> 
            <span>/</span>
            <span className="text-[#14B8A6]">{brand}</span>
          </nav>
          <h1 className="text-5xl md:text-7xl font-black text-[#0B2E2B] uppercase tracking-tighter">
            {models[0].marine_brands.name} <span className="text-[#14B8A6]">Series</span>
          </h1>
          <p className="mt-4 text-slate-500 font-bold uppercase text-xs tracking-[0.2em]">Select engine model to view available components</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => (
            <Link 
              key={model.id} 
              href={`/marine-spares/${brand}/${model.slug}`} 
              className="group relative bg-white p-10 rounded-[3rem] border border-slate-100 hover:border-[#14B8A6]/30 transition-all shadow-sm hover:shadow-2xl overflow-hidden"
            >
              {/* Subtle pattern background */}
              <div className="absolute top-0 right-0 p-8 text-slate-50 group-hover:text-teal-50 transition-colors">
                <LayoutGrid size={80} strokeWidth={1} />
              </div>

              <div className="relative z-10">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:bg-[#14B8A6] transition-all">
                  <Anchor className="text-[#14B8A6] group-hover:text-white transition-colors" size={28} />
                </div>
                
                <h2 className="text-3xl font-black text-[#0B2E2B] uppercase mb-2 tracking-tighter">
                  {model.model_name}
                </h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-10">
                  Genuine Engine Spares Support
                </p>

                <div className="flex items-center text-[#14B8A6] font-black text-xs tracking-widest bg-teal-50 w-fit px-6 py-3 rounded-full group-hover:bg-[#0B2E2B] group-hover:text-white transition-all">
                  VIEW COMPONENTS <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}