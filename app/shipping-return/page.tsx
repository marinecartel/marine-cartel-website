import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Global Shipping & Return Policy | Marine Cartel",
  description:
    "Transparent international shipping procedures, strict quality testing, warranty terms, and RMA return guidelines for marine automation components.",
  keywords: [
    "Marine equipment shipping worldwide",
    "Marine spare parts international delivery",
    "Marine automation return policy",
    "Industrial automation RMA guidelines",
    "Marine Cartel return policy"
  ],
}

export default function ShippingReturnPage() {
  return (
    <div className="bg-[#fcfcfd] text-slate-800 font-sans">

      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-[#0F766E] to-[#0B2E2B] text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-black uppercase tracking-[0.2em] bg-white/10 px-4 py-1.5 rounded-full text-teal-200">
            Export & Fulfillment Standards
          </span>
          <h1 className="text-4xl md:text-5xl font-black mt-4 tracking-tight">
            Global Shipping & Return Policy
          </h1>
          <p className="mt-4 text-base md:text-lg text-teal-100 max-w-2xl mx-auto">
            Reliable worldwide logistics, rigorous quality inspection, and transparent commercial return terms.
          </p>
        </div>
      </section>

      {/* CONTENT BODY */}
      <section className="max-w-4xl mx-auto py-16 px-6 space-y-12">

        {/* 1. SHIPPING COVERAGE */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0F766E]"></span>
            Worldwide Shipping Coverage & Transit
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Marine Cartel supplies marine automation spare parts, ship control systems, and industrial marine equipment globally. We partner with Tier-1 international couriers (DHL Express, FedEx, UPS) to ensure seamless delivery to the United States, Europe, Middle East, Asia-Pacific, and worldwide ports.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase">Order Processing</p>
              <p className="text-sm font-black text-slate-900 mt-1">1–3 Business Days</p>
              <p className="text-xs text-slate-500 mt-0.5">Includes bench testing, firmware check & export packing</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase">Express Transit Times</p>
              <p className="text-sm font-black text-slate-900 mt-1">3–8 Business Days</p>
              <p className="text-xs text-slate-500 mt-0.5">Air courier with online Airway Bill (AWB) tracking</p>
            </div>
          </div>
        </div>

        {/* 2. IMPORTANT BUYER NOTICE / PRE-DISPATCH */}
        <div className="bg-teal-50/60 border border-teal-200 p-8 rounded-3xl shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0F766E] animate-pulse"></span>
            <h3 className="text-xs font-black uppercase tracking-wider text-[#0F766E]">
              Pre-Order Verification & Transparency Notice
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Because marine automation equipment operates in mission-critical environments, we uphold stringent inspection standards. <strong>Before placing an order or finalizing dispatch</strong>, customers are encouraged to request high-resolution photos, part-number verification, technical spec sheets, and live bench-testing videos. Our logistics team provides complete verification assets prior to shipment handover.
          </p>
        </div>

        {/* 3. RETURN & REFUND POLICY (GMC COMPLIANT) */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0F766E]"></span>
              Return & Refund Policy
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Clear guidelines governing eligible returns, RMA authorizations, and inspection timelines.
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <p className="font-bold text-slate-900">1. Return Eligibility by Product Condition</p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>
                  <strong className="text-slate-800">Used Working / Surplus / Refurbished Parts:</strong> Eligible for return under our RMA process if defective or failing to match agreed specifications.
                </li>
                <li>
                  <strong className="text-slate-800">Brand New Items:</strong> Non-returnable through Marine Cartel once unsealed. Brand New factory-sealed parts carry the standard <strong>1-Year Original Manufacturer Warranty</strong>, claimable directly with the manufacturer or authorized service channels using our commercial invoice.
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <p className="font-bold text-slate-900">2. Return Window & Notification Deadlines</p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>
                  <strong className="text-slate-800">International Shipments:</strong> Notice of discrepancy, transit damage, or defect must be submitted within <strong>3 days</strong> of delivery. Approved returns must be handed over to the courier within <strong>7 days</strong> of RMA issuance.
                </li>
                <li>
                  <strong className="text-slate-800">Domestic Shipments (India):</strong> Intimation must be made within <strong>2 days</strong> of delivery, and the item dispatched within <strong>4 days</strong> of receiving return instructions.
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <p className="font-bold text-slate-900">3. Item Condition & Security Seals</p>
              <p className="text-xs">
                Items must be returned in their original received condition, complete with factory/warranty security seals intact, original protective packaging, and all included accessories. Units with broken warranty seals or evidence of unauthorized bench disassembly will not be eligible for refund.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <p className="font-bold text-slate-900">4. Return Method & RMA Authorization</p>
              <p className="text-xs">
                All returns must be shipped via trackable mail/courier to our designated facility in Bhavnagar, Gujarat, India. Prior to dispatch, buyers must contact our operations team to obtain an official <strong>Return Merchandise Authorization (RMA)</strong> number. Unsolicited shipments without an active RMA will not be accepted.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <p className="font-bold text-slate-900">5. Return Shipping, Restocking & Duties</p>
              <p className="text-xs">
                The buyer is responsible for return courier charges, insurance, and any applicable import taxes or customs duties incurred during reverse transit. A restocking fee of up to <strong>20%</strong> may be applied to cover mandatory bench re-testing, recertification, and repackaging.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <p className="font-bold text-slate-900">6. Refund Processing Timeline</p>
              <p className="text-xs">
                Upon physical receipt, our engineering team inspects the equipment within <strong>3–5 business days</strong>. Once approved, refunds are processed within <strong>5–7 business days</strong> to the original payment channel or via electronic wire transfer.
              </p>
            </div>

          </div>
        </div>

        {/* 4. CUSTOMS & IMPORT DUTIES */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0F766E]"></span>
            Customs, Import Duties & Local Taxes
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            International consignments are subject to import duties, clearance tariffs, and VAT as mandated by the destination country's customs authority. Buyers are responsible for clearing local import tariffs. Marine Cartel provides certified commercial invoices, packing lists, and HS codes to streamline regulatory clearance.
          </p>
        </div>

      </section>

      {/* FOOTER CTA */}
      <section className="bg-[#0F766E] text-white py-16 text-center px-6">
        <h2 className="text-2xl md:text-3xl font-black tracking-tight">
          Have Questions Regarding Equipment or Logistics?
        </h2>
        <p className="mt-3 text-teal-100 text-sm md:text-base max-w-xl mx-auto">
          Contact our technical sales team for test videos, detailed datasheets, and custom international shipping quotes.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/contact"
            className="bg-white text-[#0F766E] px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg hover:bg-teal-50 transition"
          >
            Contact Logistics Support
          </a>
          <a
            href="https://wa.me/917405558403"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg hover:bg-[#128C7E] transition"
          >
            Direct WhatsApp Inquiry
          </a>
        </div>
      </section>

    </div>
  )
}