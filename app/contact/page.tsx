import { Metadata } from "next"
import Link from "next/link"
import ContactForm from "./ContactForm"

export const metadata: Metadata = {
  title: "Contact Marine Cartel | Global Marine Equipment Supplier",
  description:
    "Get in touch with Marine Cartel in Bhavnagar, Gujarat, India. Official contact points for marine automation spares, technical verification, and global dispatch inquiries.",
}

export default function ContactPage() {
  return (
    <div className="bg-[#fcfcfd] text-slate-800 font-sans antialiased">

      {/* HERO */}
      <section className="bg-gradient-to-br from-[#0F766E] to-[#0B2E2B] text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-black uppercase tracking-[0.2em] bg-white/10 px-4 py-1.5 rounded-full text-teal-200">
            Direct Commercial Assistance
          </span>
          <h1 className="text-4xl md:text-5xl font-black mt-4 tracking-tight">
            Get in Touch with Marine Cartel
          </h1>
          <p className="mt-4 text-base md:text-lg text-teal-100 max-w-2xl mx-auto">
            Fast worldwide response, live bench-testing verifications, and door-to-door global shipping support.
          </p>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="max-w-6xl mx-auto py-16 px-6 grid lg:grid-cols-12 gap-12 items-start">

        {/* CONTACT FORM */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
            Send an Inquiry
          </h2>
          <p className="text-xs text-slate-500 mb-8">
            Submit your part numbers, technical queries, or request proforma invoice quotes directly.
          </p>
          <ContactForm />
        </div>

        {/* CONTACT DETAILS (GMC TRUST SIGNALS) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <h2 className="text-xl font-black text-slate-900 tracking-tight border-b border-slate-100 pb-4">
              Registered Office & Facility
            </h2>

            <div className="space-y-5 text-sm text-slate-600">
              {/* Legal Name & Address */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">Operating Base / Address</h3>
                <p className="font-bold text-slate-900 mt-1">Marine Cartel</p>
                <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                  504, Green, Prabudas Talav, Krishna Nagar,<br />
                  Bhavnagar, Gujarat, India — 364001
                </p>
              </div>

              {/* Direct Electronic Contact */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">Corporate Email</h3>
                <p className="mt-1">
                  <a href="mailto:themarinecartel@gmail.com" className="font-semibold text-slate-900 hover:text-[#0F766E] transition">
                    themarinecartel@gmail.com
                  </a>
                </p>
                
              </div>

              {/* Phone & WhatsApp */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">Direct Phone & WhatsApp</h3>
                <p className="mt-1">
                  <a href="https://wa.me/917405558403" target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-900 hover:text-[#0F766E] transition">
                    +91 74055 58403
                  </a>
                </p>
                <p className="text-[11px] text-emerald-600 font-medium mt-0.5">● Available on WhatsApp for instant technical photos & video</p>
              </div>

              {/* Business Hours */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">Operational Hours</h3>
                <p className="text-xs font-medium text-slate-900 mt-1">Monday – Saturday: 10:00 AM – 8:00 PM (IST)</p>
                <p className="text-[11px] text-slate-400">Export inquiries monitored 24/7 for urgent vessel requirements</p>
              </div>
            </div>
          </div>

          {/* QUICK CTA CARD */}
          <div className="p-6 bg-gradient-to-br from-[#0F766E] to-[#0B2E2B] text-white rounded-3xl shadow-md">
            <h3 className="text-lg font-black tracking-tight">Need Urgent Spares for a Vessel?</h3>
            <p className="mt-2 text-xs text-teal-100 leading-relaxed">
              We dispatch priority consignments via DHL Express and FedEx International Priority for fast port delivery.
            </p>
            <div className="mt-4 flex gap-2">
              <Link
                href="/products"
                className="bg-white text-[#0F766E] px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-teal-50 transition"
              >
                Browse Catalog
              </Link>
              <Link
                href="/track-order"
                className="bg-teal-800 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-teal-700 transition"
              >
                Track Order
              </Link>
            </div>
          </div>
        </div>

      </section>

      {/* EMBEDDED GOOGLE MAP SECTION */}
      <section className="bg-slate-50 py-16 px-6 border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Verified Testing & Logistics Facility
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              All automation components, PLC racks, and marine modules are stored, quality bench-tested, and dispatched directly from our Bhavnagar facility.
            </p>
          </div>

          <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-white p-2">
            <iframe
              title="Marine Cartel Facility Map"
              src="https://maps.google.com/maps?q=21.7783363,72.1595645&hl=en&z=15&output=embed"
              width="100%"
              height="350"
              style={{ border: 0, borderRadius: "1rem" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

    </div>
  )
}