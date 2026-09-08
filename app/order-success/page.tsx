"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId") || "MC-Pending"
  const part = searchParams.get("part") || "Item"
  const amount = searchParams.get("amount") || "0"
  const method = searchParams.get("method") || "Bank Wire (T/T)"
  const email = searchParams.get("email") || ""

  const [utr, setUtr] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleProofSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const { error } = await supabase
      .from("orders")
      .update({
        utr_number: utr,
        payment_status: "Proof Submitted - Verification Pending",
      })
      .eq("order_id", orderId)

    setSubmitting(false)
    if (!error) setSubmitted(true)
  }

  const waMessage = `Hello Marine Cartel,

I placed Order #${orderId}:
Part: ${part}
Amount: $${amount} USD
Payment Method: ${method}
${utr ? `Transaction Reference/UTR: ${utr}` : ""}

Please verify payment and process dispatch.`

  return (
    <div className="bg-[#fcfcfd] min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Main Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center">
          <div className="w-14 h-14 bg-teal-50 text-[#0F766E] rounded-2xl flex items-center justify-center mx-auto mb-4 font-black text-xl">✓</div>
          <h1 className="text-2xl font-black text-slate-900">Order Placed - Awaiting Payment</h1>
          <p className="text-sm text-slate-500 mt-1">Reference Order ID: <span className="font-bold text-slate-900">#{orderId}</span></p>
          <div className="inline-block mt-3 px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-lg border border-amber-200">
            Status: Payment Verification Pending
          </div>
        </div>

        {/* Banking / Remittance Procedure */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
            Official Remittance & Payment Procedure
          </h2>
          
          <div className="bg-slate-50 p-5 rounded-2xl text-xs space-y-3 text-slate-700">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Official Proforma Invoice is being generated for Order #{orderId}
            </div>

            <div className="space-y-1.5 border-t border-slate-200 pt-3">
              <p><strong className="text-slate-900">Beneficiary:</strong> Marine Cartel</p>
              <p><strong className="text-slate-900">Registered Location:</strong> Bhavnagar, Gujarat, India</p>
              <p><strong className="text-slate-900">Accepted Rails:</strong> International Bank Wire (SWIFT/TT), Payoneer, Domestic NEFT/UPI</p>
            </div>

            <div className="bg-teal-50/70 border border-teal-200 p-3 rounded-xl text-slate-800 leading-relaxed">
              <strong>Next Step:</strong> Our billing team will send the official invoice along with electronic bank wire / transfer instructions to your registered email (<span className="font-semibold text-slate-900">{email || "your email"}</span>) and WhatsApp within <strong>1–2 business hours</strong>.
            </div>
          </div>
        </div>

        {/* Proof Submission Box */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Submit Payment Confirmation</h2>
          <p className="text-xs text-slate-500 mb-4">Once paid, enter your Wire Reference, SWIFT code, or UTR number below for fast clearance.</p>

          {submitted ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold">
              ✓ Transaction reference #{utr} submitted. Our team will verify and dispatch within 1–2 business days.
            </div>
          ) : (
            <form onSubmit={handleProofSubmit} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Enter Transaction ID / UTR / Reference No."
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                className="flex-1 border rounded-xl p-3 text-xs focus:outline-none focus:border-[#0F766E]"
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-5 bg-[#0F766E] text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-[#0d645e]"
              >
                {submitting ? "Saving..." : "Submit Proof"}
              </button>
            </form>
          )}
        </div>

        {/* WhatsApp Bridge */}
        <a
          href={`https://wa.me/917405558403?text=${encodeURIComponent(waMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-4 bg-[#25D366] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-md hover:bg-[#128C7E] transition"
        >
          Confirm Payment on WhatsApp with Order #{orderId}
        </a>

        {/* Tracking Link */}
        <div className="text-center">
          <Link href={`/track-order?orderId=${orderId}`} className="text-xs font-bold text-slate-600 hover:text-[#0F766E] underline">
            Track Live Shipment Status →
          </Link>
        </div>

      </div>
    </div>
  )
}