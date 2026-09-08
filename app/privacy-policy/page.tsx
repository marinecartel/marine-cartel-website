import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Marine Cartel",
  description: "Learn how Marine Cartel collects, protects, and handles your personal and business transaction data.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#fcfcfd] min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-8">
        
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#0F766E] bg-teal-50 px-3 py-1 rounded-lg">
            Legal & Compliance
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3">Privacy Policy</h1>
          <p className="text-xs text-slate-400 mt-1">Last Updated: 2026</p>
        </div>

        <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">1. Information We Collect</h2>
            <p>
              When you place an order, request an invoice, or inquire about products on Marine Cartel, we collect necessary business details including your full name, company name, shipping/delivery address, business email, and phone/WhatsApp number.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">2. How We Use Your Information</h2>
            <p>
              Your information is exclusively used to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li>Process and fulfill equipment orders and commercial invoices.</li>
              <li>Coordinate customs clearance, freight documentation, and express delivery via DHL/FedEx.</li>
              <li>Provide dispatch tracking updates and technical support.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">3. Data Security & Storage</h2>
            <p>
              We implement enterprise-grade security protocols to protect your business records. We do not sell, rent, trade, or distribute your corporate data or personal contact details to third-party marketing agencies. Data is shared strictly with international courier partners for customs compliance and delivery.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">4. Payment Information</h2>
            <p>
              Marine Cartel processes payments via direct Bank Wire (T/T), SWIFT, and Payoneer. We do not store sensitive bank account credentials or payment card PINs on our servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">5. Contact Information</h2>
            <p>
              If you have inquiries regarding your data, reach us at:
            </p>
            <div className="bg-slate-50 p-4 rounded-xl text-xs space-y-1 text-slate-700">
              <p><strong className="text-slate-900">Business Entity:</strong> Marine Cartel</p>
              <p><strong className="text-slate-900">Location:</strong> 504, Green, Prabudas Talav, Krishna Nagar, Bhavnagar, Gujarat, India - 364005</p>
              <p><strong className="text-slate-900">Email:</strong> themarinecartel@gmail.com</p>
              <p><strong className="text-slate-900">Phone/WhatsApp:</strong> +91 74055 58403</p>
            </div>
          </section>
        </div>

      </div>
    </div>
  )
}