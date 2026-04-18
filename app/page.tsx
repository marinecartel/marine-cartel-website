import Link from "next/link"
import type { Metadata } from "next"
import { supabase } from "@/lib/supabase"
import { Cpu, Globe, Zap, PackageCheck, ShieldCheck, Users, Factory, Anchor, Ship, Droplets, Radio, Settings, LifeBuoy } from "lucide-react"
import ProductsGrid from "@/components/ProductsGrid"
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Marine Cartel | Industrial Automation & Marine Spare Parts Supplier Worldwide",
  description:
    "Buy Used, Refurbished & New PLC, HMI, Drives & Marine Spares Parts. Directly sourced from Alang & Factories. Worldwide shipping. Bulk deals available.",
}

export default async function HomePage() {

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false })
    .limit(4)

  return (
    <div className="bg-white text-gray-900">

      {/* ================= HERO SECTION ================= */}
      {/* Updated to use your Dark Teal #0B2E2B and Primary Teal #0F766E */}
      <section className="relative bg-gradient-to-br from-[#0B2E2B] via-[#0F766E] to-black text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">

          <div>
            <span className="inline-block bg-black/40 text-[#14B8A6] px-4 py-1 rounded-full text-sm font-medium mb-6 border border-[#14B8A6]/30">
              Worldwide Industrial Automation  & Marine Spares Supplier
            </span>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Marine Spares Parts & PLC, HMI, Drives, All Industrial Automation Parts
              <span className="block text-[#14B8A6] mt-2">
                In Stock. Ready to Ship.
              </span>
            </h1>

            <p className="mt-6 text-lg text-teal-50/80 max-w-xl">
              Marine Cartel supplies Used, Refurbished & New industrial automation
              & Marine Spare parts worldwide. Trusted by engineers & automation traders.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="px-8 py-3 bg-[#14B8A6] hover:bg-[#0F766E] rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-teal-900/90"
              >
                Browse Products
              </Link>

              <a
                href="https://wa.me/917405558403"
                target="_blank"
                className="px-8 py-3 bg-white text-[#0B2E2B] rounded-xl font-semibold hover:bg-teal-50 transition-all duration-300"
              >
                WhatsApp Us
              </a>
            </div>
          </div>

          {/* Hero Stats With Icons */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: PackageCheck, title: "10,000+", desc: "Products In Stock" },
              { icon: Globe, title: "Global", desc: "Worldwide Shipping" },
              { icon: Zap, title: "24h", desc: "Fast Response" },
              { icon: Cpu, title: "Bulk", desc: "Special Pricing" },
            ].map((item, i) => (
              <div key={i} className="bg-black/50 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-[#14B8A6]/50 transition-colors">
                <item.icon className="text-[#14B8A6] mb-3" size={28} />
                <h3 className="text-2xl font-bold text-[#14B8A6]">{item.title}</h3>
                <p className="text-teal-50/60 text-sm mt-2">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-[#0B2E2B]">Featured Products</h2>
          <Link href="/products" className="text-[#0F766E] font-semibold hover:text-[#14B8A6] transition-colors">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {products?.map((p: any) => {
            const whatsappText = encodeURIComponent(
              `Hello Marine Cartel,\n\nI am interested in:\n\nProduct: ${p.name}\nModel: ${p.model}\nCondition: ${p.condition}\n\nPlease share price & availability.`
            )

            const conditionStyles: Record<string, string> = {
              New: "bg-[#0F766E] text-white shadow-teal-100",
              Used: "bg-amber-500 text-white shadow-amber-100",
              Refurbished: "bg-[#14B8A6] text-white shadow-teal-100",
            }

            return (
              <div
                key={p.id}
                className="group flex flex-col bg-white rounded-[1.5rem] border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(15,118,110,0.15)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
              >
                {/* Image Section */}
                <div className="relative aspect-[4/3] m-2.5 overflow-hidden rounded-[0.5rem] bg-slate-50">
                  <Link href={`/products/${p.slug}`} className="block w-full h-full">
                    <img
                      src={p.images?.[0] || "/placeholder.png"}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </Link>

                  {/* Condition Badge */}
                  <div className="absolute top-1 left-1">
                    <span className={`px-2.5 py-1 text-[8px] font-black uppercase tracking-wider rounded-full shadow-md ${conditionStyles[p.condition] || 'bg-slate-500 text-white'}`}>
                      {p.condition}
                    </span>
                  </div>

                  {/* Model Badge */}
                  <div className="absolute bottom-1.5 left-3 right-3">
                    <div className="bg-white/85 backdrop-blur-md px-3 py-2 rounded-lg border border-white/20 shadow-lg">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                        Model No
                      </p>
                      <p className="text-xs font-black text-[#0B2E2B] truncate tracking-tight">
                        {p.model}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Info Section */}
                <div className="flex flex-col flex-grow px-5 pb-6 pt-1">
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <span className="text-[9px] font-black text-[#0F766E] uppercase tracking-widest shrink-0">
                      {p.brand}
                    </span>
                    <span className="w-0.5 h-0.5 rounded-full bg-slate-300 shrink-0"></span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider truncate">
                      {p.model_family || "Series"}
                    </span>
                  </div>

                  <Link href={`/products/${p.slug}`} className="block">
                    <h3 className="text-[15px] font-bold text-slate-900 leading-[1.3] line-clamp-2 min-h-[2.5rem] group-hover:text-[#0F766E] transition-colors duration-300">
                      {p.name}
                    </h3>
                  </Link>

                  <div className="h-px w-full bg-slate-100/80 my-4"></div>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                          Price
                        </span>

                        {p.price_type === "fixed" && p.price ? (
                          <div className="flex items-baseline gap-0.5">
                            <span className="text-[10px] font-bold text-slate-900">$</span>
                            <span className="text-xl font-black text-[#0B2E2B] tracking-tighter">
                              {p.price.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[9px] font-black text-[#0F766E] bg-teal-50 px-2 py-1 rounded-lg border border-teal-100 uppercase whitespace-nowrap">
                            On Request
                          </span>
                        )}
                      </div>

                      <a
                        href={`https://wa.me/917405558403?text=${whatsappText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-12 h-12 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-2xl transition-all active:scale-90 shadow-[0_8px_20px_-4px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_24px_-4px_rgba(37,211,102,0.5)] group-hover:rotate-6"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ================= PRODUCT CATEGORIES ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#0B2E2B]">
          Our Core Automation Categories
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: "PLC", icon: Cpu },
            { name: "HMI", icon: Users },
            { name: "AC Drives", icon: Zap },
            { name: "Servo Drives", icon: Factory },
            { name: "Control Modules", icon: Cpu },
            { name: "Power Supplies", icon: Zap },
            { name: "Industrial Cards", icon: Factory },
            { name: "Automation Spares", icon: Users },
          ].map((item, index) => (
            <div
              key={index}
              className="group bg-slate-50 hover:bg-[#0B2E2B] hover:text-white transition-all duration-300 rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl cursor-pointer"
            >
              <item.icon className="mb-4 text-[#0F766E] group-hover:text-[#14B8A6]" size={28} />
              <h3 className="text-xl font-semibold mb-3">{item.name}</h3>
              <p className="text-sm text-slate-500 group-hover:text-teal-50/60">
                High demand automation products ready for dispatch.
              </p>
            </div>
          ))}
        </div>
      </section>

       {/* ================= MARINE SPARE PARTS CATEGORIES ================= */}
<section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-100">
  <div className="text-center mb-16">
    <h2 className="text-3xl font-bold text-[#0B2E2B] mb-4">
      Marine Engineering & Spares
    </h2>
    <p className="text-slate-500 max-w-2xl mx-auto">
      Genuine machinery spares sourced directly from Alang Ship Breaking Yard. Tested and ready for global vessel dispatch.
    </p>
  </div>

  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
    {[
      { 
        name: "Main Engine Spares", 
        icon: Settings, 
        desc: "Liner, Piston, Crankshaft, and Fuel Pumps for MAN, Wartsila, and Bergen." 
      },
      { 
        name: "Hydraulic Systems", 
        icon: Droplets, 
        desc: "Hydraulic Pumps, Motors, and Control Valves for Deck Machinery." 
      },
      { 
        name: "Bridge Automation", 
        icon: Radio, 
        desc: "Marine PCB Cards, Radar units, and Navigation Controller Spares." 
      },
      { 
        name: "Auxiliary Machinery", 
        icon: Ship, 
        desc: "Air Compressors, Fresh Water Generators, and Purifier parts." 
      },
      { 
        name: "Turbochargers", 
        icon: Zap, 
        desc: "Complete units and spares for ABB, Napier, and Mitsubishi." 
      },
      { 
        name: "Governor & Controls", 
        icon: Cpu, 
        desc: "Woodward Governors and Electronic Control Units (ECU)." 
      },
      { 
        name: "Deck Spares", 
        icon: Anchor, 
        desc: "Windlass spares, Crane motors, and Mooring winch components." 
      },
      { 
        name: "Safety (LSA/FFA)", 
        icon: LifeBuoy, 
        desc: "Lifeboat engine spares, BA Sets, and Fire-fighting equipment." 
      },
    ].map((item, index) => (
      <div
        key={index}
        className="group bg-[#0B2E2B]/5 hover:bg-[#0B2E2B] hover:text-white transition-all duration-300 rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl cursor-pointer"
      >
        <item.icon className="mb-4 text-[#0F766E] group-hover:text-[#14B8A6]" size={28} />
        <h3 className="text-xl font-bold mb-3 uppercase italic tracking-tight">{item.name}</h3>
        <p className="text-sm text-slate-500 group-hover:text-teal-50/60 leading-relaxed">
          {item.desc}
        </p>
      </div>
    ))}
  </div>
</section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="bg-teal-50/30 py-20">
  <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

    {/* LEFT SIDE: WHY ENGINEERS TRUST */}
    <div>
      <h2 className="text-3xl font-bold mb-6 text-[#0B2E2B]">
        Why Engineers Trust Marine Cartel
      </h2>

      <ul className="space-y-6">
        <li className="flex gap-3">
          <ShieldCheck className="text-[#0F766E] mt-1" size={22} />
          <div>
            <h4 className="font-semibold text-lg text-[#0B2E2B]">Tested & Verified Assets</h4>
            <p className="text-slate-600 text-sm">
              Each PLC module and Marine component is rigorously checked by our technical team before dispatch.
            </p>
          </div>
        </li>

        <li className="flex gap-3">
          <Anchor className="text-[#0F766E] mt-1" size={22} />
          <div>
            <h4 className="font-semibold text-lg text-[#0B2E2B]">Direct Alang & Factories Sourcing</h4>
            <p className="text-slate-600 text-sm">
              Being at the heart of Alang, we provide genuine "Used Working" machinery spares directly from ship-breaking yards.
            </p>
          </div>
        </li>

        <li className="flex gap-3">
          <PackageCheck className="text-[#0F766E] mt-1" size={22} />
          <div>
            <h4 className="font-semibold text-lg text-[#0B2E2B]">Condition Flexibility</h4>
            <p className="text-slate-600 text-sm">
              Choose from New, Refurbished, or Used Working options to perfectly match your project budget.
            </p>
          </div>
        </li>

        <li className="flex gap-3">
          <Globe className="text-[#0F766E] mt-1" size={22} />
          <div>
            <h4 className="font-semibold text-lg text-[#0B2E2B]">Global Logistics Expertise</h4>
            <p className="text-slate-600 text-sm">
              We handle customs and fast air-freight to deliver critical spares to any port or factory worldwide.
            </p>
          </div>
        </li>
      </ul>
    </div>

    {/* RIGHT SIDE: WHO WE SERVE */}
    <div className="bg-white rounded-[2rem] shadow-xl p-10 border border-teal-100">
      <h3 className="text-2xl font-bold mb-8 text-[#0B2E2B]">Who We Serve</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Automation Side */}
        <div className="space-y-4">
          <h5 className="text-[10px] font-black text-[#14B8A6] uppercase tracking-widest border-b border-teal-50 pb-2">Automation Industry</h5>
          <div className="space-y-2">
            {[ 
              "System Integrators", 
              "PLC Panel Builders", 
              "Automation Traders", 
              "Maintenance Engineers",
              "OEM Manufacturers"
            ].map((t, i) => (
              <span key={i} className="flex items-center gap-2 text-sm font-medium text-slate-600 uppercase tracking-tighter">
                <div className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]"></div> {t}
              </span>
            ))}
          </div>
        </div>

        {/* Marine Side */}
        <div className="space-y-4">
          <h5 className="text-[10px] font-black text-[#0B2E2B] uppercase tracking-widest border-b border-slate-50 pb-2">Marine Industry</h5>
          <div className="space-y-2">
            {[ 
              "Ship Management Cos", 
              "Technical Superintendents", 
              "Vessel Owners", 
              "Marine Workshops",
              "Export Buyers"
            ].map((t, i) => (
              <span key={i} className="flex items-center gap-2 text-sm font-medium text-slate-600 uppercase tracking-tighter">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> {t}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-10 pt-6 border-t border-slate-50 italic text-[11px] text-slate-400 text-center">
        "Reliable support for industrial automation and maritime operations."
      </div>
    </div>

  </div>
</section>

      {/* ================= CTA SECTION (HYBRID FOCUS) ================= */}
<section className="bg-[#0B2E2B] text-white py-24 text-center relative overflow-hidden">
  {/* Decorative Elements */}
  <div className="absolute top-0 right-0 w-80 h-80 bg-[#0F766E] opacity-20 blur-[100px] -mr-40 -mt-40 rounded-full"></div>
  <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#14B8A6] opacity-10 blur-[100px] -ml-40 -mb-40 rounded-full"></div>
  
  <div className="max-w-4xl mx-auto px-6 relative z-10">
    <h2 className="text-3xl md:text-5xl font-bold leading-tight uppercase italic tracking-tighter">
      Critical Breakdown or <br /> 
      <span className="text-[#14B8A6]">Urgent Requirement?</span>
    </h2>
    
    <p className="text-teal-50/70 mt-6 text-lg max-w-2xl mx-auto font-medium">
      Whether it's a specific PLC model for your factory or a critical Engine spare for your vessel, we provide instant availability and global technical support.
    </p>

    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
      <a
        href="https://wa.me/917405558403"
        target="_blank"
        className="w-full sm:w-auto px-10 py-4 bg-[#14B8A6] hover:bg-[#0F766E] rounded-2xl font-bold transition-all duration-300 shadow-xl shadow-black/20 flex items-center justify-center gap-3"
      >
        <Zap size={20} fill="white" />
        SEND MODEL NO / RFQ
      </a>
      
      <Link
        href="/contact"
        className="w-full sm:w-auto px-10 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl font-bold transition-all duration-300"
      >
        CONTACT SALES
      </Link>
    </div>

    <div className="mt-8 flex items-center justify-center gap-6 opacity-50">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
        <PackageCheck size={14} /> Global Shipping
      </div>
      <div className="w-1 h-1 bg-white rounded-full"></div>
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
        <ShieldCheck size={14} /> Verified Quality
      </div>
    </div>
  </div>
</section>

      <footer className="bg-[#0B2E2B] border-t border-teal-900 text-teal-50/50 py-14">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Marine Cartel
            </h3>
            <p className="text-sm">
              From Ocean to Outlets — Supplying industrial automation & Marine Spare parts worldwide.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-[#14B8A6] transition">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#14B8A6] transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#14B8A6] transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/shipping-return" className="hover:text-[#14B8A6] transition">
                  Shipping & Return
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-[#14B8A6] transition">
                  Reviews
                </Link>
              </li>
            </ul>
          </div>

          <div>
  <h4 className="text-white font-semibold mb-4">Contact</h4>
  <p className="text-sm italic">504, Green, Prabhudas Talav, Bhavnagar, Gujarat, India</p>
  
  <p className="text-sm mt-3 flex flex-col gap-2">
    <span>
      WhatsApp: 
      <a 
        href="https://wa.me/917405558403" 
        target="_blank"
        className="hover:text-[#14B8A6] ml-1 transition"
      >
        +91 74055 58403
      </a>
    </span>
    
    <span>
      Email: 
      <a 
        href="mailto:marinecartel.hq@gmail.com" 
        className="hover:text-[#14B8A6] ml-1 transition"
      >
        marinecartel.hq@gmail.com
      </a>
    </span>
  </p>
</div>

        </div>

        <div className="text-center text-xs text-teal-900/60 mt-10">
          © {new Date().getFullYear()} Marine Cartel. All rights reserved.
        </div>
      </footer>

    </div>
  )
}