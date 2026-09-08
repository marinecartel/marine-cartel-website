"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

// Complete Global Countries List
const COUNTRIES = [
  "United States", "New Zealand", "United Kingdom", "Canada", "Australia",
  "United Arab Emirates", "Saudi Arabia", "Singapore", "Germany", "Netherlands",
  "Norway", "Denmark", "France", "Italy", "Spain", "Greece", "India",
  "Japan", "South Korea", "Malaysia", "Indonesia", "Vietnam", "Turkey",
  "Qatar", "Oman", "Kuwait", "Bahrain", "Egypt", "South Africa", "Brazil",
  "Argentina", "Belgium", "Chile", "Cyprus", "Finland", "Hong Kong", "Ireland",
  "Israel", "Mexico", "Panama", "Poland", "Portugal", "Sweden", "Switzerland",
  "Thailand", "Other (Worldwide)"
]

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const partNumber = searchParams.get("partNumber") || "N/A"
  const title = searchParams.get("title") || "Marine Component"
  const price = searchParams.get("price") || "0"
  const qty = searchParams.get("qty") || "1"

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
    paymentMethod: "Bank Wire (T/T)",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const orderId = `MC-${Date.now().toString().slice(-6)}`
    const fullAddress = `${formData.streetAddress}, ${formData.city}, ${formData.state} ${formData.postalCode}, ${formData.country}`

    // 1. Supabase insert
    const { error } = await supabase.from("orders").insert([
      {
        order_id: orderId,
        customer_name: formData.fullName,
        company_name: formData.companyName,
        email: formData.email,
        phone: formData.phone,
        address: fullAddress,
        part_number: partNumber,
        product_title: title,
        order_amount: price,
        payment_method: formData.paymentMethod,
        payment_status: "Pending Verification",
        order_status: "Order Placed",
      },
    ])

    if (error) {
      setLoading(false)
      alert("Something went wrong while placing order. Please contact us.")
      return
    }

    // 2. Instant Email Notification Trigger (Resend)
    try {
      await fetch("/api/send-order-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          customerName: formData.fullName,
          companyName: formData.companyName,
          email: formData.email,
          phone: formData.phone,
          address: fullAddress,
          partNumber,
          productTitle: title,
          amount: price,
          paymentMethod: formData.paymentMethod,
        }),
      })
    } catch (err) {
      console.warn("Order email alert failed:", err)
    }

    setLoading(false)

    // 3. Success page redirect
    router.push(
      `/order-success?orderId=${orderId}&part=${encodeURIComponent(
        partNumber
      )}&title=${encodeURIComponent(title)}&amount=${price}&method=${encodeURIComponent(
        formData.paymentMethod
      )}&email=${encodeURIComponent(formData.email)}`
    )
  }

  return (
    <div className="bg-[#fcfcfd] min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="max-w-3xl mx-auto">
        
        <div className="mb-8">
          <span className="text-[10px] font-black text-[#0F766E] uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-lg">
            Secure On-Site Order
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
            Checkout & Commercial Invoice
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Complete the shipping information below to place your order and receive an official commercial invoice.
          </p>
        </div>

        {/* Order Summary Box */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm mb-8">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">
            Item Details
          </h2>
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-slate-900">{title}</p>
              <p className="text-xs font-medium text-[#0F766E] mt-0.5">Model / Part: {partNumber}</p>
              <p className="text-xs text-slate-500 mt-1">Quantity: {qty}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-slate-900">${price}</span>
              <span className="text-[10px] font-bold text-slate-400 ml-1">USD</span>
              <p className="text-[10px] font-bold text-emerald-600 mt-0.5">Worldwide Delivery</p>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0F766E]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Company Name (Optional)
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Vessel Ops LLC"
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0F766E]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Business Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="procurement@company.com"
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0F766E]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 555 019 2834"
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0F766E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Street Address *
            </label>
            <input
              type="text"
              name="streetAddress"
              required
              value={formData.streetAddress}
              onChange={handleChange}
              placeholder="Building name, street, suite"
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0F766E]"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                City *
              </label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0F766E]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                State / Region *
              </label>
              <input
                type="text"
                name="state"
                required
                value={formData.state}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0F766E]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Postal Code *
              </label>
              <input
                type="text"
                name="postalCode"
                required
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0F766E]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Country *
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0F766E] bg-white"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Payment Method Specification (Google Merchant Compliant & Multi-Option) */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Select Payment Method *
            </label>

            {/* Option 1: Bank Wire / SWIFT */}
            <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${formData.paymentMethod === "Bank Wire (T/T)" ? "border-[#0F766E] bg-teal-50/40 ring-1 ring-[#0F766E]" : "border-slate-200 hover:bg-slate-50"}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="Bank Wire (T/T)"
                checked={formData.paymentMethod === "Bank Wire (T/T)"}
                onChange={handleChange}
                className="mt-1 w-4 h-4 accent-[#0F766E]"
              />
              <div>
                <p className="text-sm font-bold text-slate-900">
                  International Bank Wire (T/T) / SWIFT Transfer
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official Proforma Invoice generated with corporate electronic wire details. Preferred for B2B export clearance.
                </p>
              </div>
            </label>

            {/* Option 2: Payoneer Transfer */}
            <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${formData.paymentMethod === "Payoneer Transfer" ? "border-[#0F766E] bg-teal-50/40 ring-1 ring-[#0F766E]" : "border-slate-200 hover:bg-slate-50"}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="Payoneer Transfer"
                checked={formData.paymentMethod === "Payoneer Transfer"}
                onChange={handleChange}
                className="mt-1 w-4 h-4 accent-[#0F766E]"
              />
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Payoneer Global Receiving Transfer
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct transfer to our verified USD / EUR / GBP receiving accounts.
                </p>
              </div>
            </label>

            {/* Option 3: UPI / NEFT (Domestic Orders) */}
            <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${formData.paymentMethod === "UPI / NEFT (India Only)" ? "border-[#0F766E] bg-teal-50/40 ring-1 ring-[#0F766E]" : "border-slate-200 hover:bg-slate-50"}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="UPI / NEFT (India Only)"
                checked={formData.paymentMethod === "UPI / NEFT (India Only)"}
                onChange={handleChange}
                className="mt-1 w-4 h-4 accent-[#0F766E]"
              />
              <div>
                <p className="text-sm font-bold text-slate-900">
                  UPI / GPay / NetBanking (Domestic Indian Orders Only)
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct UPI / QR transfer & GST Tax Invoice for delivery addresses within India.
                </p>
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#0F766E] hover:bg-[#0d645e] text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-teal-100 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? "Processing Order..." : "Confirm Order & Generate Official Invoice"}
          </button>
        </form>

      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-slate-400 text-sm">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}