import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shipping & Return Policy | Marine Cartel Global Marine Equipment Supplier",
  description:
    "Marine Cartel provides worldwide shipping for marine automation spare parts and ship control systems. Learn about our international shipping process, delivery time, return policy and quality assurance standards.",
  keywords: [
    "Marine equipment shipping worldwide",
    "Marine spare parts international delivery",
    "Ship automation parts return policy",
    "Global marine supplier shipping policy",
    "Marine Cartel return and refund policy"
  ],
}

export default function ShippingReturnPage() {
  return (
    <div className="bg-white text-slate-800">

      {/* HERO */}
      <section className="bg-gradient-to-br from-[#0F766E] to-[#0B2E2B] text-white py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black">
            Global Shipping & Return Policy
          </h1>
          <p className="mt-6 text-lg text-teal-100">
            Reliable Worldwide Delivery for Marine Automation & Industrial Marine Equipment
          </p>
        </div>
      </section>

      {/* SHIPPING SECTION */}
      <section className="max-w-5xl mx-auto py-20 px-6 space-y-16">

        <div>
          <h2 className="text-3xl font-black mb-6 text-[#0F766E]">
            Worldwide Shipping Coverage
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Marine Cartel supplies marine automation spare parts, ship control systems,
            and industrial marine equipment globally. We ship to Asia, Europe,
            Middle East, North America, South America, and Africa through trusted
            international logistics partners.
          </p>
        </div>

        <div>
          <h2 className="text-3xl font-black mb-6 text-[#0F766E]">
            Processing & Delivery Time
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Orders are processed within 1–3 business days after confirmation.
            Delivery time depends on destination country and shipping method.
            Express international shipping options are available for urgent marine requirements.
          </p>
        </div>

        <div>
          <h2 className="text-3xl font-black mb-6 text-[#0F766E]">
            Secure Packaging & Quality Assurance
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            All marine equipment is professionally inspected, tested, and securely
            packaged before dispatch. Our quality control process ensures reliable
            performance and compliance with international marine industry standards.
          </p>
        </div>

        <div>
          <h2 className="text-3xl font-black mb-6 text-[#0F766E]">
            Return & Refund Policy
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            If a product arrives damaged or does not match the confirmed specifications,
            customers must notify us within 7 days of delivery. After inspection and verification,
            we will arrange replacement, repair, or refund as applicable.
          </p>
        </div>

        <div>
          <h2 className="text-3xl font-black mb-6 text-[#0F766E]">
            Customs & Import Duties
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            International buyers are responsible for customs duties, import taxes,
            and local clearance requirements as per their country regulations.
            Our team provides commercial invoices and necessary shipping documents
            to support smooth customs processing.
          </p>
        </div>

      </section>

      {/* CTA */}
      <section className="bg-[#0F766E] text-white py-20 text-center px-6">
        <h2 className="text-3xl md:text-4xl font-black">
          Need Marine Equipment Delivered Worldwide?
        </h2>
        <p className="mt-6 text-teal-100 text-lg">
          Contact Marine Cartel today for competitive pricing and secure global shipping.
        </p>
        <a
          href="/contact"
          className="inline-block mt-10 bg-white text-[#0F766E] px-8 py-4 rounded-full font-bold shadow-lg hover:scale-105 transition"
        >
          Request a Quote
        </a>
      </section>

    </div>
  )
}
