import Link from "next/link"
import type { Metadata } from "next"
import { supabase } from "@/lib/supabase"
import { Cpu, Globe, Zap, PackageCheck, ShieldCheck, Users, Factory } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Marine Cartel | Industrial Automation Parts Supplier Worldwide",
  description:
    "Buy Used, Refurbished & New PLC, HMI, Drives, Servo & Industrial Automation Parts. Worldwide shipping. Bulk deals available.",
}

export default async function HomePage() {

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false })
    .limit(4)

  return (
    <div className="bg-white text-gray-900">

      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            Marine <span className="text-green-600">Cartel</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/" className="hover:text-green-600 transition">Home</Link>
            <Link href="/products" className="hover:text-green-600 transition">Products</Link>
            <Link href="/contact" className="hover:text-green-600 transition">Contact</Link>
          </nav>

          <Link
            href="/products"
            className="hidden md:inline-block px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-semibold"
          >
            Browse Products
          </Link>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">

          <div>
            <span className="inline-block bg-green-600/20 text-green-400 px-4 py-1 rounded-full text-sm font-medium mb-6">
              Worldwide Industrial Automation Supplier
            </span>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              PLC, HMI, Drives & Automation Parts
              <span className="block text-green-400 mt-2">
                In Stock. Ready to Ship.
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-300 max-w-xl">
              Marine Cartel supplies Used, Refurbished & New industrial automation
              parts worldwide. Trusted by engineers & automation traders.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-semibold transition"
              >
                Browse Products
              </Link>

              <a
                href="https://wa.me/917405558403"
                target="_blank"
                className="px-8 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition"
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
              <div key={i} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <item.icon className="text-green-400 mb-3" size={28} />
                <h3 className="text-2xl font-bold text-green-400">{item.title}</h3>
                <p className="text-gray-300 text-sm mt-2">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Link href="/products" className="text-green-600 font-semibold hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products?.map((p: any) => (
            <Link
              key={p.id}
              href={`/products/${p.slug}`}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition border overflow-hidden"
            >
              <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
                <img
                  src={p.images?.[0]}
                  alt={p.name}
                  className="max-h-full object-contain group-hover:scale-105 transition"
                />
              </div>

              <div className="p-5 space-y-2">
                <div className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full inline-block">
                  {p.model}
                </div>
                <h3 className="font-semibold line-clamp-2">{p.name}</h3>
                <p className="text-sm text-gray-500">{p.brand}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= PRODUCT CATEGORIES ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
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
              className="group bg-gray-50 hover:bg-black hover:text-white transition rounded-2xl p-8 border shadow-sm hover:shadow-xl cursor-pointer"
            >
              <item.icon className="mb-4 text-green-600 group-hover:text-green-400" size={28} />
              <h3 className="text-xl font-semibold mb-3">{item.name}</h3>
              <p className="text-sm text-gray-500 group-hover:text-gray-300">
                High demand automation products ready for dispatch.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

          <div>
            <h2 className="text-3xl font-bold mb-6">
              Why Engineers Trust Marine Cartel
            </h2>

            <ul className="space-y-6">
              <li className="flex gap-3">
                <ShieldCheck className="text-green-600 mt-1" size={22} />
                <div>
                  <h4 className="font-semibold text-lg">Tested & Verified Parts</h4>
                  <p className="text-gray-600 text-sm">
                    Each product checked before dispatch.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <PackageCheck className="text-green-600 mt-1" size={22} />
                <div>
                  <h4 className="font-semibold text-lg">Used, Refurbished & New</h4>
                  <p className="text-gray-600 text-sm">
                    Flexible condition options to match budget.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <Zap className="text-green-600 mt-1" size={22} />
                <div>
                  <h4 className="font-semibold text-lg">Fast WhatsApp Support</h4>
                  <p className="text-gray-600 text-sm">
                    Direct engineer-to-engineer communication.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-10 border">
            <h3 className="text-2xl font-bold mb-4">Who We Serve</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <span>System Integrators</span>
              <span>PLC Panel Builders</span>
              <span>Automation Traders</span>
              <span>Maintenance Engineers</span>
              <span>OEM Manufacturers</span>
              <span>Export Buyers</span>
            </div>
          </div>

        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="bg-black text-white py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Looking for Specific PLC or Drive?
        </h2>
        <p className="text-gray-400 mt-4">
          Send model number on WhatsApp and get instant availability & best price.
        </p>
        <a
          href="https://wa.me/917405558403"
          target="_blank"
          className="inline-block mt-8 px-10 py-4 bg-green-600 hover:bg-green-700 rounded-xl font-semibold transition"
        >
          Chat on WhatsApp
        </a>
      </section>

<footer className="bg-gray-950 border-t border-gray-800 text-gray-400 py-14">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Marine Cartel
            </h3>
            <p className="text-sm">
              From Ocean to Outlets — Supplying industrial automation parts worldwide.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-white transition">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <p className="text-sm">Bhavnagar, Gujarat, India</p>
            <p className="text-sm mt-2">
              WhatsApp: 
              <a 
                href="https://wa.me/917405558403" 
                target="_blank"
                className="hover:text-white ml-1 transition"
              >
                +91 74055 58403
              </a>
            </p>
          </div>

        </div>

        <div className="text-center text-xs text-gray-500 mt-10">
          © {new Date().getFullYear()} Marine Cartel. All rights reserved.
        </div>
      </footer>

    </div>
  )
}
