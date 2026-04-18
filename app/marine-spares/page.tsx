import { Search, Anchor, Ship, Settings, Gauge, ArrowRight, Zap, Boxes, Cpu, Layers, Disc } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// Helper function to get icons based on category name
const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('engine')) return <Cpu size={32} />;
  if (n.includes('pump')) return <Settings size={32} />;
  if (n.includes('purifier')) return <Disc size={32} />;
  if (n.includes('compressor')) return <Gauge size={32} />;
  return <Boxes size={32} />;
};

export default async function MarineSparesPage() {
  // Database optimization: Only select what you need
  const { data: brands } = await supabase.from('marine_brands').select('id, name, slug').order('name', { ascending: true });
  const { data: categories } = await supabase.from('marine_categories').select('id, name, slug').order('name', { ascending: true });
  
  // Dynamic Popular Models: Fetching top models from DB instead of static list
  const { data: popularModels } = await supabase
    .from('marine_models')
    .select('model_name, slug, marine_brands(slug)')
    .limit(20);

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#0B2E2B] pt-32 pb-44 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#14B8A6] opacity-5 skew-x-12 translate-x-20 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-full text-[#14B8A6] text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            Directly Sourced from Alang Ship Breaking Yard
          </span>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase leading-none">
            Marine <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14B8A6] to-teal-200">Spares</span>
          </h1>
          
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search className="text-slate-400 group-focus-within:text-[#14B8A6] transition-colors" size={24} />
            </div>
            <input 
              type="text" 
              placeholder="Search Engine Model (e.g. 6EY18L), Part Name, or Drawing No..."
              className="w-full pl-16 pr-40 py-7 rounded-[2rem] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] focus:ring-8 focus:ring-teal-500/10 outline-none text-slate-800 text-lg font-bold transition-all placeholder:text-slate-300 uppercase"
            />
            <button className="absolute right-3 top-3 bottom-3 bg-[#14B8A6] text-[#0B2E2B] px-10 rounded-[1.4rem] font-black text-xs tracking-widest hover:bg-[#0B2E2B] hover:text-white transition-all hidden md:block border border-teal-400/20">
              SEARCH STOCK
            </button>
          </div>
        </div>
      </section>

      {/* 2. BRAND NAVIGATION */}
      <section className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
        <div className="bg-white p-4 rounded-[2.5rem] shadow-xl border border-slate-100">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 text-center">
            {brands?.map((brand) => (
              <Link key={brand.id} href={`/marine-spares/${brand.slug}`}>
                <div className="p-6 rounded-2xl flex flex-col items-center hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl mb-4 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                    <span className="font-black text-2xl text-[#0B2E2B] group-hover:text-[#14B8A6]">{brand.name[0]}</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">{brand.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CATEGORY NAVIGATION */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black text-[#0B2E2B] uppercase tracking-tighter">Browse by <span className="text-[#14B8A6]">Machinery</span></h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Technical Grade Spares & Units</p>
          </div>
          
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories?.map((cat) => (
            <CategoryCard 
              key={cat.id}
              icon={getCategoryIcon(cat.name)}
              title={cat.name}
              desc={`Sourced from dismantled vessels. High-quality ${cat.name} spares ready for dispatch from Bhavnagar/Alang.`}
              slug={cat.slug}
            />
          ))}
        </div>
      </section>

      {/* 4. DYNAMIC ENGINE MODELS */}
      <section className="bg-white py-24 border-y border-slate-100 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-12 text-center md:text-left">
            <div className="h-[2px] w-12 bg-[#14B8A6]"></div>
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">In-Stock Engine Series</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {popularModels?.map((model: any) => (
              <Link 
                key={model.slug} 
                href={`/marine-spares/${model.marine_brands.slug}/${model.slug}`} 
                className="group p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-[#0B2E2B] transition-all"
              >
                
                <h3 className="text-xl font-black text-[#0B2E2B] uppercase group-hover:text-white mt-1 leading-tight">{model.model_name}</h3>
                <div className="mt-4 flex items-center text-[8px] font-black text-[#14B8A6] opacity-0 group-hover:opacity-100 transition-opacity">
                  VIEW PARTS <ArrowRight size={10} className="ml-1"/>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// UI SUB-COMPONENT: CategoryCard (Design Untouched)
function CategoryCard({ icon, title, desc, slug }: any) {
  return (
    <Link href={`/marine-spares/category/${slug}`} className="group relative bg-white p-10 rounded-[3rem] border border-slate-100 hover:border-teal-500/30 transition-all shadow-sm hover:shadow-2xl overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-[3] transition-transform duration-700"></div>
      
      <div className="relative z-10">
        <div className="mb-8 bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center group-hover:bg-[#14B8A6] group-hover:text-white transition-all shadow-inner text-teal-600">
          {icon}
        </div>
        <h3 className="text-2xl font-black text-[#0B2E2B] mb-4 uppercase tracking-tighter leading-tight">{title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-10 font-medium">{desc}</p>
        <div className="flex items-center text-[#14B8A6] font-black text-xs tracking-widest">
          CHECK STOCK <ArrowRight className="ml-3 group-hover:translate-x-3 transition-transform" size={18} />
        </div>
      </div>
    </Link>
  );
}