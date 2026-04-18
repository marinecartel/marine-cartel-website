import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function SearchPage(props: { searchParams: Promise<{ model?: string }> }) {
  const { model } = await props.searchParams;

  const { data: results } = await supabase
    .from('marine_models')
    .select('*, marine_brands(slug, name)')
    .ilike('model_name', `%${model}%`);

  return (
    <div className="pt-40 px-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-black uppercase mb-8 text-[#0B2E2B]">Search Results for: {model}</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {results?.map((res) => (
          <Link key={res.id} href={`/marine-spares/${res.marine_brands.slug}/${res.slug}`} className="p-8 bg-slate-50 border rounded-3xl hover:border-teal-500 transition-all">
            <p className="text-[10px] font-black text-teal-600 uppercase">{res.marine_brands.name}</p>
            <h2 className="text-xl font-black text-[#0B2E2B] uppercase">{res.model_name}</h2>
          </Link>
        ))}
      </div>
      {results?.length === 0 && <p className="text-slate-400 font-bold uppercase">No matching engine models found.</p>}
    </div>
  );
}