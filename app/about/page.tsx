import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About Marine Cartel | Global Marine Automation Equipment Supplier",
  description:
    "Marine Cartel is a trusted worldwide supplier of marine automation spare parts, ship control systems, and industrial marine equipment. We deliver globally with reliability and quality assurance.",
}

export default function AboutPage() {
  return (
    <div className="bg-white text-slate-800">

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-[#0F766E] to-[#0B2E2B] text-white py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black leading-tight">
            Powering Global Marine & Industrial Automation Parts
          </h1>
          <p className="mt-6 text-lg md:text-xl text-teal-100">
            Trusted Worldwide Supplier of Marine Automation Spare Parts & Industrial Equipment.
          </p>
          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <Link
              href="/products"
              className="bg-white text-[#0F766E] px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition"
            >
              Explore Products
            </Link>
            <Link
              href="/contact"
              className="border border-white px-6 py-3 rounded-full font-bold hover:bg-white hover:text-[#0F766E] transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-10">
          Who We Are
        </h2>
        <p className="text-lg leading-relaxed text-center max-w-4xl mx-auto text-slate-600">
          Marine Cartel is a global supplier of marine automation equipment,
          ship control systems, and industrial marine spare parts. We serve
          ship owners, marine engineers, ship management companies, and
          industrial clients worldwide with high-quality new, used, and
          refurbished equipment.
        </p>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-16">
            Why Choose Marine Cartel
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Global Shipping",
                desc: "Fast and secure worldwide shipping with reliable logistics partners.",
              },
              {
                title: "Quality Assurance",
                desc: "All equipment inspected and tested before dispatch.",
              },
              {
                title: "Competitive Pricing",
                desc: "Affordable pricing without compromising on quality.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition"
              >
                <h3 className="text-xl font-bold mb-4 text-[#0F766E]">
                  {item.title}
                </h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GLOBAL REACH */}
      <section className="max-w-6xl mx-auto py-20 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-black mb-8">
          Our Global Reach
        </h2>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          We supply marine automation systems and ship spare parts to clients
          across Asia, Europe, Middle East, and North America. Our worldwide
          network ensures timely delivery and professional support.
        </p>
      </section>

      {/* CTA SECTION */}
      <section className="bg-[#0F766E] text-white py-20 text-center px-6">
        <h2 className="text-3xl md:text-4xl font-black">
          Looking for Reliable Marine Equipment?
        </h2>
        <p className="mt-6 text-teal-100 text-lg">
          Contact our team today and get competitive pricing with fast global delivery.
        </p>
        <Link
          href="/contact"
          className="inline-block mt-10 bg-white text-[#0F766E] px-8 py-4 rounded-full font-bold shadow-lg hover:scale-105 transition"
        >
          Get a Quote
        </Link>
      </section>
    </div>
  )
}
