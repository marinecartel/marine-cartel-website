"use client"
import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import Link from "next/link"

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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"inventory" | "orders">("inventory")
  
  // INVENTORY STATES
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [pendingIndexCount, setPendingIndexCount] = useState(0)
  const [syncing, setSyncing] = useState(false)
  const itemsPerPage = 500

  // ORDERS STATES
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [savingOrderId, setSavingOrderId] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const fetchProducts = async () => {
    setLoading(true)
    const from = page * itemsPerPage
    const to = from + itemsPerPage - 1

    const { data, error, count } = await supabase
      .from("products")
      .select("*", { count: 'exact' })
      .order("created_at", { ascending: false })
      .range(from, to)

    const { count: pendingCount } = await supabase
      .from("products")
      .select("*", { count: 'exact', head: true })
      .eq('is_indexed', false)

    if (!error) {
      setProducts(data || [])
      if (count !== null) setTotalCount(count)
      if (pendingCount !== null) setPendingIndexCount(pendingCount)
    } else {
      console.error("Fetch error:", error.message)
    }
    setLoading(false)
  }

  const fetchOrders = async () => {
    setLoadingOrders(true)
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setOrders(data)
    }
    setLoadingOrders(false)
  }

  useEffect(() => {
    if (activeTab === "inventory") {
      fetchProducts()
    } else {
      fetchOrders()
    }
  }, [page, activeTab])

  const handleGoogleSync = async () => {
  setSyncing(true)
  try {
    const res = await fetch('/api/google-index', { method: 'POST' })
    const result = await res.json()
    if (!res.ok || result.error) {
      alert(`Sync Error: ${result.error || 'Failed to sync'}`)
    } else {
      alert(result.message || `Sync Complete! ${result.processed || 0} items updated.`)
    }
    fetchProducts()
  } catch (err: any) {
    alert("Sync failed. Check API route or network connection.")
  } finally {
    setSyncing(false)
  }
}

const handleBingSync = async () => {
    setSyncing(true)
    try {
      const res = await fetch('/api/bing-index', { method: 'POST' })
      const result = await res.json()
      if (!res.ok || result.error) {
        alert(`Bing Sync Error: ${result.error || 'Check server logs'}`)
      } else {
        alert(result.message || `Bing Sync Complete! ${result.processed || 0} items updated.`)
      }
      fetchProducts()
    } catch (err) {
      alert("Bing Sync failed. Check API route.")
    } finally {
      setSyncing(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Kya aap is product ko delete karna chahte hain?")) {
      const { error } = await supabase.from("products").delete().eq("id", id)
      if (!error) {
        fetchProducts()
      } else {
        alert("Error deleting product: " + error.message)
      }
    }
  }

  const handleOrderUpdate = async (orderId: string, updates: Partial<Order>) => {
    setSavingOrderId(orderId)
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
    setSavingOrderId(null)
  }

  const getMissingData = (item: any) => {
    const missing = [];
    if (!item.description || item.description.length < 20) missing.push("Desc");
    const hasSpecs = item.technical_specs && Object.keys(item.technical_specs).length > 0;
    if (!hasSpecs) missing.push("Specs");
    if (!item.price || item.price === "" || item.price === "0" || item.price === 0) {
      missing.push("Price");
    }
    const imgCount = Array.isArray(item.images) ? item.images.length : 0;
    if (imgCount < 3) {
      missing.push("Low Img"); 
    }
    return missing;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* HEADER SECTION WITH NAVIGATION TABS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Marine Cartel Operations</h1>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setActiveTab("inventory")}
              className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition ${
                activeTab === "inventory"
                  ? "bg-slate-900 text-white shadow"
                  : "bg-white text-slate-600 border hover:bg-slate-100"
              }`}
            >
              Inventory ({totalCount})
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition flex items-center gap-2 ${
                activeTab === "orders"
                  ? "bg-[#0F766E] text-white shadow"
                  : "bg-white text-slate-600 border hover:bg-slate-100"
              }`}
            >
              Orders & Shipments
              {orders.length > 0 && (
                <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black">
                  {orders.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {activeTab === "inventory" && (
          <div className="flex gap-4">
            <div className="flex bg-white rounded-lg border shadow-sm overflow-hidden">
              <button 
                disabled={page === 0 || loading}
                onClick={() => { setPage(page - 1); window.scrollTo(0,0); }}
                className="px-3 py-2 text-xs font-bold border-r hover:bg-gray-50 disabled:opacity-30"
              >
                ← Prev
              </button>
              <button 
                disabled={(page + 1) * itemsPerPage >= totalCount || loading}
                onClick={() => { setPage(page + 1); window.scrollTo(0,0); }}
                className="px-3 py-2 text-xs font-bold hover:bg-gray-50 disabled:opacity-30"
              >
                Next →
              </button>
            </div>
            <Link href="/admin/products/new" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow-md font-bold transition-all">
              + Add New
            </Link>
          </div>
        )}

        {activeTab === "orders" && (
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-100 shadow-sm transition"
          >
            ↻ Refresh Orders
          </button>
        )}
      </div>

      {/* TAB 1: INVENTORY CONTENT */}
      {activeTab === "inventory" && (
        <>
          {/* GOOGLE & BING INDEXING CONTROL BOX */}
          {/* SEARCH ENGINE SYNC CONTROL BOX */}
          <div className="bg-slate-900 rounded-xl p-4 mb-6 flex flex-col md:flex-row justify-between items-center border border-slate-700 shadow-xl gap-4">
            <div>
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Search Engine Indexing Center
              </h3>
              <p className="text-slate-400 text-[10px] uppercase tracking-wider font-bold mt-1">
                Pending Google: <span className="text-yellow-400">{pendingIndexCount} Pages</span> | Google Limit: 200/day
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2.5">
              <button 
                onClick={handleGoogleSync}
                disabled={syncing || pendingIndexCount === 0}
                className={`px-5 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest transition-all ${
                  syncing ? 'bg-gray-700 text-gray-400' : 'bg-white text-slate-900 hover:bg-blue-600 hover:text-white'
                }`}
              >
                {syncing ? 'Syncing...' : '🚀 Google Sync'}
              </button>

              <button 
                onClick={handleBingSync}
                disabled={syncing}
                className={`px-5 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest transition-all ${
                  syncing ? 'bg-gray-700 text-gray-400' : 'bg-[#00809d] text-white hover:bg-[#006880]'
                }`}
              >
                {syncing ? 'Syncing...' : '⚡ Bing IndexNow'}
              </button>
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-600 text-[10px] uppercase font-black tracking-widest">
                <tr>
                  <th className="p-4 w-20">Image</th>
                  <th className="p-4">Product Details</th>
                  <th className="p-4 w-48">Data Health</th>
                  <th className="p-4 text-center w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {loading ? (
                  <tr><td colSpan={4} className="p-20 text-center text-gray-400 animate-pulse">Loading Inventory...</td></tr>
                ) : (
                  products.map((item) => {
                    const missing = getMissingData(item);
                    let imgList: string[] = [];
                    if (Array.isArray(item.images)) {
                      imgList = item.images;
                    } else if (typeof item.images === 'string') {
                      imgList = item.images.split('\n').filter(Boolean);
                    }
                    const mainImg = imgList.length > 0 ? imgList[0] : null;

                    return (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="relative w-14 h-14 bg-white rounded-lg border-2 border-gray-100 flex items-center justify-center overflow-hidden shadow-sm text-center">
                            {mainImg ? (
                              <>
                                <img src={mainImg} alt="part" className="w-12 h-full object-contain p-1" />
                                <span className={`absolute top-0 right-0 text-white text-[9px] px-1.5 py-0.5 font-black rounded-bl-md shadow-sm ${
                                  imgList.length < 3 ? 'bg-red-500 animate-pulse' : 'bg-blue-600'
                                }`}>
                                  {imgList.length}
                                </span>
                              </>
                            ) : (
                              <span className="text-[9px] text-gray-300 font-bold uppercase leading-tight">No<br/>Img</span>
                            )}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="font-bold text-slate-800 text-base leading-tight mb-1">{item.model || item.model_no}</div>
                          <div className="text-xs text-gray-500 font-medium flex items-center gap-2">
                            <span className="text-slate-700 font-bold">{item.brand}</span> | {item.condition === 'Pre-owned' ? 'Used working' : item.condition}
                            {item.is_indexed && <span className="bg-blue-50 text-blue-600 text-[8px] px-1 rounded border border-blue-100 uppercase">Indexed</span>}
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            {item.price ? (
                              <span className="text-blue-600 font-bold text-xs">${item.price}</span>
                            ) : (
                              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">Price: On Request</span>
                            )}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex flex-wrap gap-1.5">
                            {missing.length > 0 ? (
                              missing.map(m => (
                                <span key={m} className="bg-red-50 text-red-600 text-[9px] px-2 py-1 rounded-md border border-red-100 font-black uppercase shadow-sm">
                                  ⚠ {m}
                                </span>
                              ))
                            ) : (
                              <span className="bg-green-50 text-green-600 text-[9px] px-2 py-1 rounded-md border border-green-100 font-black uppercase shadow-sm">
                                Ready ✅
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="p-4 text-center">
                          <div className="flex justify-center items-center gap-4">
                            <Link href={`/admin/products/edit/${item.id}`} className="text-blue-600 font-extrabold hover:text-blue-800 transition-all hover:scale-105">
                              Edit
                            </Link>
                            <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600 transition-all p-1 hover:bg-red-50 rounded">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {/* FOOTER PAGINATION */}
          <div className="flex justify-center items-center mt-8 gap-4">
            <button 
              disabled={page === 0 || loading}
              onClick={() => { setPage(page - 1); window.scrollTo(0,0); }}
              className="bg-white border px-6 py-2 rounded-xl font-bold text-sm hover:bg-gray-50 disabled:opacity-20 transition-all"
            >
              Previous
            </button>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Page {page + 1} of {Math.ceil(totalCount / itemsPerPage)}
            </span>
            <button 
              disabled={(page + 1) * itemsPerPage >= totalCount || loading}
              onClick={() => { setPage(page + 1); window.scrollTo(0,0); }}
              className="bg-slate-900 text-white px-8 py-2 rounded-xl font-bold text-sm hover:bg-blue-600 disabled:opacity-20 shadow-lg transition-all"
            >
              Next Page
            </button>
          </div>
        </>
      )}

      {/* TAB 2: ORDERS MANAGEMENT CONTENT */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {loadingOrders ? (
            <div className="p-16 text-center text-slate-400 text-sm">Loading received orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-16 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
              No orders received yet.
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.order_id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4"
              >
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
                        Buyer Reference / UTR: {order.utr_number}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                      Payment Status
                    </label>
                    <select
                      value={order.payment_status}
                      onChange={(e) =>
                        handleOrderUpdate(order.order_id, { payment_status: e.target.value })
                      }
                      className="w-full text-xs font-semibold p-2 border rounded-xl bg-white border-slate-200 focus:outline-none focus:border-[#0F766E]"
                    >
                      <option value="Pending Verification">Pending Verification</option>
                      <option value="Proof Submitted - Verification Pending">Proof Submitted</option>
                      <option value="Payment Received / Verified">Payment Received / Verified</option>
                      <option value="Cancelled / Unpaid">Cancelled / Unpaid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                      Fulfillment Status
                    </label>
                    <select
                      value={order.order_status}
                      onChange={(e) =>
                        handleOrderUpdate(order.order_id, { order_status: e.target.value })
                      }
                      className="w-full text-xs font-semibold p-2 border rounded-xl bg-white border-slate-200 focus:outline-none focus:border-[#0F766E]"
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Testing & Packing">Testing & Packing</option>
                      <option value="Dispatched / In Transit">Dispatched / In Transit</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                      Courier Partner
                    </label>
                    <input
                      type="text"
                      defaultValue={order.courier_partner || ""}
                      placeholder="DHL Express / FedEx"
                      onBlur={(e) =>
                        handleOrderUpdate(order.order_id, { courier_partner: e.target.value })
                      }
                      className="w-full text-xs p-2 border rounded-xl bg-white border-slate-200 focus:outline-none focus:border-[#0F766E]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                      AWB Tracking Number
                    </label>
                    <div className="flex gap-1.5 items-center">
                      <input
                        type="text"
                        defaultValue={order.tracking_number || ""}
                        placeholder="e.g. 1234567890"
                        onBlur={(e) =>
                          handleOrderUpdate(order.order_id, { tracking_number: e.target.value })
                        }
                        className="w-full text-xs p-2 border rounded-xl bg-white border-slate-200 focus:outline-none focus:border-[#0F766E]"
                      />
                      {savingOrderId === order.order_id && (
                        <span className="text-[10px] font-bold text-teal-600">Saved</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}