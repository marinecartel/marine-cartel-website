"use client"
import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import Link from "next/link"

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [pendingIndexCount, setPendingIndexCount] = useState(0) // Kitne baaki hain
  const [syncing, setSyncing] = useState(false)
  const itemsPerPage = 500

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const fetchProducts = async () => {
    setLoading(true)
    const from = page * itemsPerPage
    const to = from + itemsPerPage - 1

    // Main Inventory Fetch
    const { data, error, count } = await supabase
      .from("products")
      .select("*", { count: 'exact' })
      .order("created_at", { ascending: false })
      .range(from, to)

    // Pending Index Count Fetch
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

  useEffect(() => {
    fetchProducts()
  }, [page])

  // Google Sync Function
  const handleGoogleSync = async () => {
    setSyncing(true)
    try {
      // Yahan hum aapka banaya hua API route call karenge
      const res = await fetch('/api/google-index', { method: 'POST' })
      const result = await res.json()
      alert(`Sync Complete! ${result.processed || 0} items updated.`)
      fetchProducts() // Data refresh karne ke liye
    } catch (err) {
      alert("Sync failed. Check API route.")
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
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Marine Cartel Inventory</h1>
            <p className="text-xs text-slate-500 font-semibold">
              Total Live Products: <span className="text-blue-600">{totalCount}</span> | Page {page + 1}
            </p>
        </div>
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
      </div>

      {/* GOOGLE INDEXING CONTROL BOX - Naya Section */}
      <div className="bg-slate-900 rounded-xl p-4 mb-6 flex flex-col md:flex-row justify-between items-center border border-slate-700 shadow-xl">
        <div className="mb-4 md:mb-0">
          <h3 className="text-white font-bold text-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Google Search Console Sync
          </h3>
          <p className="text-slate-400 text-[10px] uppercase tracking-wider font-bold mt-1">
            Pending Indexing: <span className="text-yellow-400">{pendingIndexCount} Pages</span> | API Limit: 200/day
          </p>
        </div>
        <button 
          onClick={handleGoogleSync}
          disabled={syncing || pendingIndexCount === 0}
          className={`px-8 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest transition-all ${
            syncing ? 'bg-gray-700 text-gray-400' : 'bg-white text-slate-900 hover:bg-blue-500 hover:text-white'
          }`}
        >
          {syncing ? 'Processing...' : '🚀 Start Google Sync'}
        </button>
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
    </div>
  )
}