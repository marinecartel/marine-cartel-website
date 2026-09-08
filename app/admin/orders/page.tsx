"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Order = {
  id: number
  order_id: string
  created_at: string
  customer_name: string
  company_name: string | null
  email: string
  phone: string
  address: string
  part_number: string
  product_title: string
  order_amount: string
  payment_method: string
  payment_status: string
  order_status: string
  utr_number: string | null
  courier_partner: string | null
  tracking_number: string | null
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)

  // Fetch all orders
  const fetchOrders = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setOrders(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // Update order fields
  const handleUpdate = async (orderId: string, updates: Partial<Order>) => {
    setSavingId(orderId)
    const { error } = await supabase
      .from("orders")
      .update(updates)
      .eq("order_id", orderId)

    if (error) {
      alert("Failed to update order: " + error.message)
    } else {
      setOrders(prev =>
        prev.map(o => (o.order_id === orderId ? { ...o, ...updates } : o))
      )
    }
    setSavingId(null)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans text-slate-900">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Orders & Shipments Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage incoming orders, verify international payments, and assign DHL/FedEx tracking.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
        >
          ↻ Refresh List
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
          No orders received yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4"
            >
              {/* Header: ID, Date, Amount */}
              <div className="flex flex-wrap justify-between items-start gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-[#0F766E]">
                      #{order.order_id}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(order.created_at).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">
                    {order.product_title} (Part: {order.part_number})
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-lg font-black text-slate-900">
                    ${order.order_amount} USD
                  </span>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Via {order.payment_method}
                  </p>
                </div>
              </div>

              {/* Customer & Address Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl text-xs text-slate-600">
                <div>
                  <p className="font-bold text-slate-800">
                    {order.customer_name} {order.company_name ? `(${order.company_name})` : ""}
                  </p>
                  <p className="text-slate-500 mt-0.5">Email: {order.email}</p>
                  <p className="text-slate-500">Phone: {order.phone}</p>
                </div>

                <div className="md:col-span-2">
                  <p className="font-bold text-slate-700">Delivery Address:</p>
                  <p className="text-slate-600 mt-0.5">{order.address}</p>
                  {order.utr_number && (
                    <p className="mt-1.5 font-bold text-emerald-700 bg-emerald-50 inline-block px-2 py-0.5 rounded border border-emerald-200">
                      Buyer UTR / Ref: {order.utr_number}
                    </p>
                  )}
                </div>
              </div>

              {/* Status Controls & Logistics Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                {/* 1. Payment Status */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={order.payment_status}
                    onChange={(e) =>
                      handleUpdate(order.order_id, { payment_status: e.target.value })
                    }
                    className="w-full text-xs font-semibold p-2 border rounded-xl bg-white border-slate-200 focus:outline-none focus:border-[#0F766E]"
                  >
                    <option value="Pending Verification">Pending Verification</option>
                    <option value="Proof Submitted - Verification Pending">Proof Submitted</option>
                    <option value="Payment Received / Verified">Payment Received / Verified</option>
                    <option value="Cancelled / Unpaid">Cancelled / Unpaid</option>
                  </select>
                </div>

                {/* 2. Order Fulfillment Status */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                    Fulfillment Status
                  </label>
                  <select
                    value={order.order_status}
                    onChange={(e) =>
                      handleUpdate(order.order_id, { order_status: e.target.value })
                    }
                    className="w-full text-xs font-semibold p-2 border rounded-xl bg-white border-slate-200 focus:outline-none focus:border-[#0F766E]"
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Testing & Packing">Testing & Packing</option>
                    <option value="Dispatched / In Transit">Dispatched / In Transit</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                {/* 3. Courier Partner */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                    Courier Partner
                  </label>
                  <input
                    type="text"
                    defaultValue={order.courier_partner || ""}
                    placeholder="DHL Express / FedEx"
                    onBlur={(e) =>
                      handleUpdate(order.order_id, { courier_partner: e.target.value })
                    }
                    className="w-full text-xs p-2 border rounded-xl bg-white border-slate-200 focus:outline-none focus:border-[#0F766E]"
                  />
                </div>

                {/* 4. Tracking / AWB No. */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                    Airway Bill (AWB) Tracking No.
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      defaultValue={order.tracking_number || ""}
                      placeholder="e.g. 1234567890"
                      onBlur={(e) =>
                        handleUpdate(order.order_id, { tracking_number: e.target.value })
                      }
                      className="w-full text-xs p-2 border rounded-xl bg-white border-slate-200 focus:outline-none focus:border-[#0F766E]"
                    />
                    {savingId === order.order_id && (
                      <span className="text-[10px] font-bold text-teal-600 self-center">Saving...</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}