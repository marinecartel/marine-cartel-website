import { Metadata } from "next"
import Link from "next/link"
import ContactForm from "./ContactForm"

export const metadata: Metadata = {
  title: "Contact Marine Cartel | Global Marine Equipment Supplier",
  description:
    "Contact Marine Cartel for marine automation spare parts, ship control systems and industrial marine equipment. Worldwide shipping and fast quotation support.",
}

export default function ContactPage() {
  return (
    <div className="bg-white text-slate-800">

      {/* HERO */}
      <section className="bg-gradient-to-br from-[#0F766E] to-[#0B2E2B] text-white py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black">
            Get in Touch with Marine Cartel
          </h1>
          <p className="mt-6 text-lg md:text-xl text-teal-100">
            Fast Worldwide Shipping • Competitive Pricing • Professional Support
          </p>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="max-w-6xl mx-auto py-20 px-6 grid md:grid-cols-2 gap-16">

        {/* CONTACT FORM */}
        <ContactForm />

        {/* CONTACT DETAILS */}
        <div>
          <h2 className="text-3xl font-black mb-8">
            Our Contact Information
          </h2>

          <div className="space-y-8 text-lg text-slate-600">

            <div>
              <h3 className="font-bold text-[#0F766E]">Business Email</h3>
              <p>marinecartel9@gmail.com</p>
              <p>mc@marinecarte.store</p>
              <p>global@marinecarte.store</p>
            </div>

            <div>
              <h3 className="font-bold text-[#0F766E]">Phone / WhatsApp</h3>
              <p>+91 740 555 8403</p>
            </div>

            <div>
              <h3 className="font-bold text-[#0F766E]">Business Hours</h3>
              <p>Monday – Saturday | 11:00 AM – 10:00 PM</p>
            </div>

            <div>
              <h3 className="font-bold text-[#0F766E]">Global Shipping</h3>
              <p>
                We deliver marine & industrial automation equipment worldwide with
                secure packaging and trusted courier partners.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 bg-[#0F766E] text-white rounded-2xl">
            <h3 className="text-2xl font-black">
              Need Immediate Assistance?
            </h3>
            <p className="mt-4 text-teal-100">
              Browse our product catalog and find the right marine automation solution today.
            </p>
            <Link
              href="/products"
              className="inline-block mt-6 bg-white text-[#0F766E] px-6 py-3 rounded-full font-bold hover:scale-105 transition"
            >
              View Products
            </Link>
          </div>
        </div>
      </section>

      {/* MAP SECTION (Optional) */}
      <section className="bg-slate-100 py-16 px-6 text-center">
        <h2 className="text-3xl font-black mb-8">
          Our Global Presence
        </h2>
        <p className="text-slate-600 max-w-3xl mx-auto">
          Marine Cartel supplies marine automation systems and spare parts to
          clients worldwide including Asia, Europe, Middle East, and North America.
        </p>
      </section>
    </div>
  )
}

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()

  const formData = new FormData(e.currentTarget)

  await fetch("/api/contact", {
    method: "POST",
    body: JSON.stringify({
      full_name: formData.get("full_name"),
      email: formData.get("email"),
      company: formData.get("company"),
      message: formData.get("message"),
    }),
    headers: { "Content-Type": "application/json" },
  })

  alert("Inquiry Sent Successfully!")
  e.currentTarget.reset()
}
