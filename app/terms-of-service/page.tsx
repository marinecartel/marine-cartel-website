import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | Marine Cartel",
  description: "Terms and conditions governing the purchase, supply, testing, and delivery of marine automation and industrial machinery components.",
}

export default function TermsOfServicePage() {
  return (
    <div className="bg-[#fcfcfd] min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-8">
        
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#0F766E] bg-teal-50 px-3 py-1 rounded-lg">
            Commercial Agreement
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3">Terms of Service</h1>
          <p className="text-xs text-slate-400 mt-1">Last Updated: 2026</p>
        </div>

        <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">1. Commercial Scope</h2>
            <p>
              Marine Cartel supplies marine automation components, PLC modules, sensors, engine controls, and industrial spare parts to commercial ship owners, fleet managers, and industrial plants worldwide. By submitting an order or invoice request, buyers agree to these terms.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">2. Product Condition & Pre-Dispatch Testing</h2>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li><strong>Brand New:</strong> Supplied in original manufacturer packaging with standard 1-year factory warranty.</li>
              <li><strong>Used Working / Surplus / Refurbished:</strong> Bench-tested, inspected, and verified operational prior to dispatch. Pre-dispatch photos and test videos are provided upon request.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">3. Orders, Invoicing & Remittance</h2>
            <p>
              Orders submitted through our website initiate an official Proforma Invoice. Shipments are prepared for export upon receipt of confirmed electronic remittance via Bank Wire (T/T), SWIFT, or authorized business payment rails.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">4. Customs Clearance, Tariffs & Duties</h2>
            <p>
              All shipments are dispatched from Bhavnagar, Gujarat, India. International consignments are subject to import tariffs, local VAT, and destination customs regulations. The buyer is the importer of record and responsible for applicable destination import clearances.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">5. Governing Law & Jurisdiction</h2>
            <p>
              Any disputes arising from international supply contracts or commercial transactions will be subject to the legal jurisdiction of the courts in Bhavnagar, Gujarat, India.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">6. Operational Contact</h2>
            <p className="text-xs">
              For commercial contracts or technical verifications, contact Marine Cartel at <strong className="text-slate-900">themarinecartel@gmail.com</strong> or WhatsApp: <strong className="text-slate-900">+91 74055 58403</strong>.
            </p>
          </section>
        </div>

      </div>
    </div>
  )
}