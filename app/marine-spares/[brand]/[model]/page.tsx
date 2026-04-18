import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowRight, Settings2, ShieldCheck, Gauge, Info } from "lucide-react";

export default async function EngineModelPage(props: { params: Promise<{ brand: string, model: string }> }) {
  const { brand, model } = await props.params;

  // FETCH UPDATED: Brand aur Model slug dono match hone chahiye
  const { data: engine } = await supabase
    .from('marine_models')
    .select('*, marine_brands!inner(name, slug)') // Inner join with brand slug
    .eq('slug', model)
    .eq('marine_brands.slug', brand) // Fixed: Namespace check
    .single();

  // Fetch all parts linked to this specific engine model
  const { data: parts } = await supabase
    .from('marine_spares')
    .select('*')
    .eq('model_id', engine?.id);

  if (!engine) return <div className="pt-40 text-center uppercase font-black text-slate-400">Engine Model Not Found in Inventory</div>;

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumbs for SEO & UX */}
        <nav className="flex gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">
          <Link href="/marine-spares" className="hover:text-[#14B8A6]">Inventory</Link>
          <span>/</span>
          {/* Brand slug direct URL se aa raha hai */}
          <Link href={`/marine-spares/${brand}`} className="hover:text-[#14B8A6]">{brand.replace(/-/g, ' ')}</Link>
          <span>/</span>
          <span className="text-[#14B8A6]">{engine.model_name}</span>
        </nav>

        {/* Engine Header & Specs */}
        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-1 w-12 bg-[#14B8A6]"></div>
              <span className="text-xs font-black text-[#14B8A6] uppercase tracking-widest">Technical Specifications</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-[#0B2E2B] uppercase tracking-tighter mb-8 leading-none">
              {engine.marine_brands?.name} <span className="text-[#14B8A6]">{engine.model_name}</span>
            </h1>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SpecBox label="Bore" value={engine.bore || '---'} icon={<Gauge size={14}/>} />
              <SpecBox label="Stroke" value={engine.stroke || '---'} icon={<Settings2 size={14}/>} />
              <SpecBox label="Configuration" value={engine.configuration || 'L-Type'} icon={<Info size={14}/>} />
              <SpecBox label="Status" value="In Stock" icon={<ShieldCheck size={14}/>} />
            </div>
          </div>

          <div className="bg-[#0B2E2B] p-10 rounded-[3rem] text-white flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform">
              <Settings2 size={120} />
            </div>
            <h3 className="text-2xl font-black uppercase mb-4 relative z-10">Alang <br/>Sourcing</h3>
            <p className="text-xs text-teal-100/60 font-bold leading-relaxed uppercase tracking-wider relative z-10">
              All spares are extracted from genuine vessels at Alang Yard. Fully inspected & ready for worldwide shipping.
            </p>
          </div>
        </div>

        {/* Inventory Table Section */}
        <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-2xl shadow-slate-200/50">
          <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <h2 className="font-black text-[#0B2E2B] uppercase tracking-tighter text-2xl">Available Spares Inventory</h2>
            <div className="px-6 py-2 bg-slate-50 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Total {parts?.length || 0} Parts Found
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] border-b border-slate-100">
                <tr>
                  <th className="p-8">Component Description</th>
                  <th className="p-8">Drawing / Part No.</th>
                  <th className="p-8">Condition</th>
                  <th className="p-8 text-right">Inventory Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parts?.map((part) => (
                  <tr key={part.id} className="hover:bg-teal-50/30 transition-all group">
                    <td className="p-8">
                      <Link href={`/marine-spares/${brand}/${model}/${part.slug}`} className="font-black text-[#0B2E2B] uppercase text-lg group-hover:text-[#14B8A6] transition-colors block">
                        {part.part_name}
                      </Link>
                      <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">OEM Authentic</span>
                    </td>
                    <td className="p-8">
                      <span className="font-mono text-sm bg-slate-50 px-3 py-1 rounded-md text-slate-500 border border-slate-100">
                        {part.drawing_no || 'TBA'}
                      </span>
                    </td>
                    <td className="p-8">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#14B8A6]"></div>
                        <span className="text-[11px] font-black uppercase text-slate-600 tracking-wider">{part.condition}</span>
                      </div>
                    </td>
                    <td className="p-8 text-right">
                      <Link 
                        href={`/marine-spares/${brand}/${model}/${part.slug}`} 
                        className="inline-flex items-center gap-2 bg-[#0B2E2B] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#14B8A6] transition-all shadow-lg hover:shadow-[#14B8A6]/20"
                      >
                        VIEW STOCK <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {(!parts || parts.length === 0) && (
            <div className="p-20 text-center font-black text-slate-300 uppercase tracking-[0.3em]">
              Currently no parts listed for this model.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SpecBox({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between h-32 hover:border-[#14B8A6]/30 transition-all">
      <div className="flex justify-between items-center">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <div className="text-[#14B8A6] bg-teal-50 p-2 rounded-lg">{icon}</div>
      </div>
      <p className="text-xl font-black text-[#0B2E2B] uppercase tracking-tighter">{value}</p>
    </div>
  );
}