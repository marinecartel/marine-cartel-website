import { supabase } from "@/lib/supabase";
import { Anchor, MessageCircle, Truck, ShieldCheck, ChevronRight, Share2, Printer } from "lucide-react";
import Link from "next/link";


interface PageProps {
  params: Promise<{ brand: string; model: string; productSlug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { brand, model, productSlug } = await params;

  // Fetch product data with engine details
  const { data: product } = await supabase
    .from("marine_spares")
    .select("*, marine_models(model_name)")
    .eq("slug", productSlug)
    .single();

  if (!product) return <div className="pt-40 text-center font-black uppercase text-slate-400">Component Not Found</div>;

  // WhatsApp Message Formatting
  const whatsappNumber = "917405558403";
  const message = `Hi Marine Cartel, I am interested in:
Part: ${product.part_name}
Engine: ${product.marine_models?.model_name}
Drawing No: ${product.drawing_no || 'N/A'}
Please share price and actual photos.`;

  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/marine-spares" className="hover:text-teal-500">Inventory</Link>
          <ChevronRight size={12} />
          <Link href={`/marine-spares/${brand}`} className="hover:text-teal-500">{brand}</Link>
          <ChevronRight size={12} />
          <Link href={`/marine-spares/${brand}/${model}`} className="hover:text-teal-500">{model}</Link>
          <ChevronRight size={12} />
          <span className="text-teal-500">{product.part_name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Side: Product Image/Placeholder */}
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-[3rem] aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-200 relative overflow-hidden group">
              <div className="absolute top-6 left-6 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase text-slate-600">Alang Stock Available</span>
              </div>
              
              <Anchor size={120} className="text-slate-200 group-hover:text-teal-100 transition-colors" strokeWidth={1} />
              <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Image Awaiting Upload</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
                  <Truck className="text-teal-600" size={24} />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Shipping</p>
                    <p className="text-xs font-black text-[#0B2E2B] uppercase">Global Logistics</p>
                  </div>
               </div>
               <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
                  <ShieldCheck className="text-teal-600" size={24} />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Quality</p>
                    <p className="text-xs font-black text-[#0B2E2B] uppercase">OEM Verified</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Side: Product Info & Actions */}
          <div className="pt-4">
            <h1 className="text-5xl md:text-6xl font-black text-[#0B2E2B] uppercase tracking-tighter leading-none mb-6">
              {product.part_name}
            </h1>
            
            <p className="text-slate-500 font-medium leading-relaxed mb-8 max-w-xl">
              High-quality used marine machinery component sourced from sustainable ship recycling at Alang, India. 
              Thoroughly inspected for dimensional accuracy and structural integrity.
            </p>

            {/* Technical Data Table */}
            <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 mb-10">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Technical Specifications</h3>
              <div className="space-y-4">
                <DataField label="Engine Series" value={product.marine_models?.model_name} />
                <DataField label="Drawing / Part No" value={product.drawing_no || 'Contact for info'} />
                <DataField label="Component Condition" value={product.condition} />
                <DataField label="Origin yard" value="Alang, Gujarat" />
              </div>
            </div>

            {/* CTA: WhatsApp Inquiry */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`}
                target="_blank"
                className="flex-1 flex items-center justify-center gap-3 bg-[#25D366] text-white py-6 rounded-[1.5rem] font-black text-lg shadow-xl shadow-green-200 hover:scale-[1.02] active:scale-95 transition-all uppercase"
              >
                <MessageCircle size={24} /> Get Quote & Photos
              </a>
              
              <button className="p-6 bg-slate-100 text-[#0B2E2B] rounded-[1.5rem] hover:bg-[#0B2E2B] hover:text-white transition-all group">
                <Share2 size={24} className="group-hover:rotate-12 transition-transform" />
              </button>
            </div>

            <p className="mt-6 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Email: marinecartel.hq@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component for clean data rows
function DataField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center border-b border-slate-200/50 pb-4 last:border-0 last:pb-0">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="text-sm font-black text-[#0B2E2B] uppercase">{value}</span>
    </div>
  );
}