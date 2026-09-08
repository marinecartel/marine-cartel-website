"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function TrackOrderPage() {
  const searchParams = useSearchParams()
  const initialId = searchParams.get("orderId") || ""

  const [orderId, setOrderId] = useState(initialId)
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleTrack = async (searchId: string) => {
    if (!searchId) return
    setLoading(true)
    setSearched(true)

    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", searchId.trim())
      .maybeSingle()

    setOrder(data)
    setLoading(false)
  }

  useEffect(() => {
    if (initialId) handleTrack(initialId)
  }, [initialId])

  return (
    <div className="bg-[#fcfcfd] min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-3xl font-black text-slate-900 text-center tracking-tight">Track Your Marine Order</h1>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex gap-2">
          <input
            type="text"
            placeholder="Enter Order ID (e.g. MC-123456)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-1 border rounded-xl p-3 text-sm focus:outline-none focus:border-[#0F766E]"
          />
          <button
            onClick={() => handleTrack(orderId)}
            className="px-6 bg-[#0F766E] text-white rounded-xl text-xs font-bold uppercase tracking-wider"
          >
            Track
          </button>
        </div>

        {loading && <p className="text-center text-sm text-slate-500">Searching order records...</p>}

        {searched && !loading && !order && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-sm text-slate-600">
            No order found with ID <span className="font-bold">{orderId}</span>. Please verify the ID.
          </div>
        )}

        {order && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Order Reference</p>
                <p className="text-lg font-black text-slate-900">#{order.order_id}</p>
                <p className="text-xs text-slate-600 mt-1">{order.product_title}</p>
              </div>
              <span className="px-3 py-1 bg-teal-50 text-[#0F766E] border border-teal-200 text-xs font-bold rounded-lg">
                {order.order_status || "Processing"}
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <p><strong className="text-slate-900">Payment Status:</strong> {order.payment_status}</p>
              {order.utr_number && <p><strong className="text-slate-900">Reference / UTR:</strong> {order.utr_number}</p>}
              <p><strong className="text-slate-900">Shipping Partner:</strong> {order.courier_partner || "DHL Express / FedEx (Pending Dispatch)"}</p>
              <p><strong className="text-slate-900">Airway Bill (AWB) Tracking:</strong> {order.tracking_number || "Generated upon payment clearance"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}