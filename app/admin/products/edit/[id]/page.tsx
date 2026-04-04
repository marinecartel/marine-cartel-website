"use client"
import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter, useParams } from "next/navigation"

export default function EditProduct() {
  const router = useRouter()
  const { id } = useParams() // URL se product ID nikalne ke liye
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    model: "",
    brand: "",
    category: "",
    category_main: "",
    condition: "",
    images: "", 
    description: "",
    price: "",
    model_family: "",
    warranty: "",
    technical_specs: "" 
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // 1. Purana Data Fetch Karo
  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single()

      if (error) {
        alert("Product not found!")
        router.push("/admin/dashboard")
        return
      }

      if (data) {
        setFormData({
          model: data.model || "",
          brand: data.brand || "",
          category: data.category || "",
          category_main: data.category_main || "",
          condition: data.condition || "",
          images: Array.isArray(data.images) ? data.images.join('\n') : "",
          description: data.description || "",
          price: data.price || "",
          model_family: data.model_family || "",
          warranty: data.warranty || "",
          technical_specs: data.technical_specs ? JSON.stringify(data.technical_specs, null, 2) : ""
        })
      }
      setLoading(false)
    }
    fetchProduct()
  }, [id])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const imageArray = formData.images.split('\n').map(url => url.trim()).filter(url => url !== "")
      
      let finalSpecs = {}
      if (formData.technical_specs) {
        try { finalSpecs = JSON.parse(formData.technical_specs) } 
        catch (err) { alert("Invalid JSON format!"); setSaving(false); return; }
      }

      const priceValue = formData.price.toString().trim();
      const currentPriceType = priceValue && priceValue !== "" ? "fixed" : "on_request";

      const { error } = await supabase
        .from("products")
        .update({ 
          model: formData.model,
          brand: formData.brand,
          category: formData.category,
          category_main: formData.category_main,
          condition: formData.condition,
          images: imageArray,
          description: formData.description,
          price: priceValue || null,
          price_type: currentPriceType,
          model_family: formData.model_family,
          warranty: formData.warranty,
          technical_specs: finalSpecs,
        })
        .eq("id", id)

      if (error) throw error
      alert("Product Updated Successfully! ✅")
      router.push("/admin/dashboard")
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-20 text-center font-bold">Loading Product Data...</div>

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-2xl rounded-3xl my-10 border border-blue-100">
      <div className="flex justify-between items-center mb-8 border-b-2 pb-4">
        <h1 className="text-3xl font-black text-slate-800 italic">Edit Product: <span className="text-blue-600 font-mono">{formData.model}</span></h1>
        <button onClick={() => router.back()} className="text-gray-500 hover:text-black font-bold">← Back</button>
      </div>
      
      
      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Identity Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">Model No</label>
            <input value={formData.model} required className="w-full p-3 border-2 rounded-xl focus:border-blue-500 outline-none" 
              onChange={(e) => setFormData({...formData, model: e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">Brand</label>
            <input value={formData.brand} required className="w-full p-3 border-2 rounded-xl focus:border-blue-500 outline-none"
              onChange={(e) => setFormData({...formData, brand: e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">Model Family</label>
            <input value={formData.model_family} className="w-full p-3 border-2 rounded-xl focus:border-blue-500 outline-none"
              onChange={(e) => setFormData({...formData, model_family: e.target.value})} />
          </div>
        </div>

        {/* Categories & Price */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <input value={formData.category_main} placeholder="Main Category" className="p-3 border-2 rounded-xl"
            onChange={(e) => setFormData({...formData, category_main: e.target.value})} />
          <input value={formData.category} placeholder="Sub Category" className="p-3 border-2 rounded-xl"
            onChange={(e) => setFormData({...formData, category: e.target.value})} />
          
          <input 
            value={formData.condition} 
            placeholder="Condition (New / Used working / Refurbished)" 
            className="p-3 border-2 rounded-xl focus:border-blue-500 outline-none"
            onChange={(e) => setFormData({...formData, condition: e.target.value})} />

          <input value={formData.price} placeholder="Price ($)" className="p-3 border-2 rounded-xl bg-yellow-50 font-bold"
            onChange={(e) => setFormData({...formData, price: e.target.value})} />
        </div>

        {/* Multi-Image Box with Preview */}
        <div className="p-6 bg-blue-50 rounded-2xl border-2 border-blue-100">
          <label className="block text-sm font-bold text-blue-900 mb-2">Update Images (One per line)</label>
          <textarea value={formData.images} rows={3} className="w-full p-4 border-2 rounded-xl mb-4 outline-none"
            onChange={(e) => setFormData({...formData, images: e.target.value})} />
          <div className="flex flex-wrap gap-2">
            {formData.images.split('\n').filter(url => url.trim()).map((url, i) => (
              <img key={i} src={url} className="w-16 h-16 object-contain bg-white border rounded shadow-sm" />
            ))}
          </div>
        </div>

        {/* JSON Specs Box */}
        <div className="p-6 bg-gray-100 rounded-2xl border-2 border-gray-200">
          <label className="block text-sm font-bold text-gray-700 mb-2">Technical Specs (JSON)</label>
          <textarea value={formData.technical_specs} rows={8} className="w-full p-4 bg-white text-blue-900 border-2 rounded-xl font-mono text-sm"
            onChange={(e) => setFormData({...formData, technical_specs: e.target.value})} />
        </div>

        {/* Description */}
        <textarea value={formData.description} rows={5} className="w-full p-4 border-2 rounded-xl"
          placeholder="Description (Markdown)"
          onChange={(e) => setFormData({...formData, description: e.target.value})} />

        <div className="pt-4">
  <button 
    type="submit"
    disabled={saving} 
    className={`w-full py-5 rounded-2xl font-black text-xl transition-all shadow-2xl 
      ${saving 
        ? "bg-gray-400 cursor-not-allowed" 
        : "bg-blue-700 hover:bg-black text-white active:scale-95"
      }`}
  >
    {saving ? (
      <span className="flex items-center justify-center gap-2">
        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        UPDATING DATABASE...
      </span>
    ) : (
      "SAVE CHANGES ✅"
    )}
  </button>
</div>
      </form>
    </div>
  )
}