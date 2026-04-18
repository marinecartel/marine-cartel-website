"use client"
import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import Papa from "papaparse"
import { useRouter } from "next/navigation"

export default function BulkUpload() {
  const [csvText, setCsvText] = useState("")
  const [previewData, setPreviewData] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // CSV ko Table mein badalne ke liye
  const handleParse = () => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setPreviewData(results.data)
      },
    })
  }

  const handleBulkSave = async () => {
    if (previewData.length === 0) return
    setUploading(true)

    // Data ko Supabase ke format mein saaf karna
    const formattedData = previewData.map(item => ({
      model: item.model || item.model_no || "",
      model_family: item.model_family || "",
      brand: item.brand || "",
      category: item.category || "",
      category_main: item.category_main || "",
      condition: item.condition || "Pre-owned",
      description: item.description || "",
      price: item.price || null,
      price_type: item.price ? "fixed" : "on_request",
      images: item.images ? item.images.split(',').map((img: string) => img.trim()) : [],
      technical_specs: item.specs ? JSON.parse(item.specs) : {},
    }))

    const { error } = await supabase.from("products").insert(formattedData)

    if (error) {
      alert("Error: " + error.message)
    } else {
      alert(`${formattedData.length} Products Added Successfully! ✅`)
      router.push("/admin/dashboard")
    }
    setUploading(false)
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-black text-slate-800 mb-6">Bulk Product Import</h1>
      
      {/* Input Area */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8">
        <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">Paste CSV Data Here (Header: model, brand, price, images, description...)</label>
        <textarea 
          rows={8}
          className="w-full p-4 border-2 rounded-xl font-mono text-sm focus:border-blue-500 outline-none"
          placeholder="model,brand,price,condition&#10;6ES7315,Siemens,500,New&#10;2711P,Allen Bradley,1200,Pre-owned"
          onChange={(e) => setCsvText(e.target.value)}
        />
        <button 
          onClick={handleParse}
          className="mt-4 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition-all"
        >
          Preview Data
        </button>
      </div>

      {/* Preview Table */}
      {previewData.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">
          <div className="p-4 bg-blue-50 border-b flex justify-between items-center">
            <span className="font-bold text-blue-900">{previewData.length} Products Found</span>
            <button 
              disabled={uploading}
              onClick={handleBulkSave}
              className="bg-green-600 text-white px-10 py-3 rounded-xl font-black hover:bg-green-700 disabled:opacity-50 shadow-lg"
            >
              {uploading ? "UPLOADING..." : "UPLOAD ALL TO SUPABASE"}
            </button>
          </div>
          
          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  {Object.keys(previewData[0]).map(key => (
                    <th key={key} className="p-3 border-b uppercase text-[10px] font-black">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {previewData.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    {Object.values(row).map((val: any, j) => (
                      <td key={j} className="p-3 border-r max-w-[200px] truncate">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}