"use client"
import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"

export default function AddProduct() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [dbConditions, setDbConditions] = useState<string[]>([])
  
  const [formData, setFormData] = useState({
    model_no: "",
    brand: "",
    category: "",
    category_main: "",
    condition: "",
    images: "", 
    description: "",
    price: "", // Yahan price store hoga
    model_family: "",
    warranty: "",
    technical_specs: "" 
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const getConditions = async () => {
      const { data } = await supabase.from('products').select('condition')
      if (data) {
        const unique = Array.from(new Set(data.map(item => item.condition).filter(Boolean)))
        setDbConditions(unique as string[])
      }
    }
    getConditions()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const imageArray = formData.images.split('\n').map(url => url.trim()).filter(url => url !== "")
      
      let finalSpecs = {}
      if (formData.technical_specs) {
        try { finalSpecs = JSON.parse(formData.technical_specs) } 
        catch (err) { alert("Invalid JSON!"); setLoading(false); return; }
      }

      // 🔥 PRICE LOGIC FIX:
      // Agar price enter ki gayi hai toh 'fixed', warna 'on_request'
      const priceValue = formData.price.trim();
      const currentPriceType = priceValue && priceValue !== "" ? "fixed" : "on_request";

      const { error } = await supabase.from("products").insert([
        { 
          model_no: formData.model_no,
          brand: formData.brand,
          category: formData.category,
          category_main: formData.category_main,
          condition: formData.condition,
          images: imageArray,
          description: formData.description,
          price: priceValue || null, // Price save karein
          price_type: currentPriceType, // 🔥 Yeh column update hoga
          model_family: formData.model_family,
          warranty: formData.warranty,
          technical_specs: finalSpecs,
          created_at: new Date() 
        }
      ])

      if (error) throw error
      alert("Product Published! 🚢")
      router.push("/admin/dashboard")
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-2xl rounded-3xl my-10 border">
      <h1 className="text-3xl font-black text-slate-800 mb-8 border-b-4 border-blue-600 pb-2 inline-block">New Product Entry</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input placeholder="Model No" required className="p-3 border-2 rounded-xl" 
            onChange={(e) => setFormData({...formData, model_no: e.target.value})} />
          <input placeholder="Brand" required className="p-3 border-2 rounded-xl"
            onChange={(e) => setFormData({...formData, brand: e.target.value})} />
          <input placeholder="Model Family" className="p-3 border-2 rounded-xl"
            onChange={(e) => setFormData({...formData, model_family: e.target.value})} />
        </div>

        {/* Row 2 (Price Section) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <input placeholder="Main Category" className="p-3 border-2 rounded-xl"
            onChange={(e) => setFormData({...formData, category_main: e.target.value})} />
          <input placeholder="Sub Category" className="p-3 border-2 rounded-xl"
            onChange={(e) => setFormData({...formData, category: e.target.value})} />
          
          <input placeholder="Condition (e.g. Used working)" className="p-3 border-2 rounded-xl focus:border-blue-500 outline-none"
            onChange={(e) => setFormData({...formData, condition: e.target.value})} />

          {/* Price Input with Logic */}
          <div className="relative">
            <span className="absolute left-3 top-3.5 text-gray-400">$</span>
            <input 
              type="text"
              placeholder="Price (Leave blank for On Request)" 
              className="w-full p-3 pl-7 border-2 rounded-xl bg-yellow-50 focus:border-yellow-500 outline-none font-bold"
              onChange={(e) => setFormData({...formData, price: e.target.value})} 
            />
          </div>
        </div>

        {/* Images & Previews */}
        <div className="p-6 bg-blue-50 rounded-2xl border-2 border-blue-100">
          <label className="block text-sm font-bold text-blue-900 mb-2">Image URLs (Line by Line)</label>
          <textarea rows={3} className="w-full p-4 border-2 rounded-xl mb-4"
            onChange={(e) => setFormData({...formData, images: e.target.value})} />
          <div className="flex flex-wrap gap-2">
            {formData.images.split('\n').filter(url => url.trim()).map((url, i) => (
              <img key={i} src={url} className="w-16 h-16 object-contain bg-white border rounded" />
            ))}
          </div>
        </div>

        {/* JSON Specs */}
        <div className="p-6 bg-gray-50 rounded-2xl border-2 border-gray-200">
          <label className="block text-sm font-bold text-gray-700 mb-2">Paste Technical Specs (JSON)</label>
          <textarea rows={6} className="w-full p-4 bg-white text-blue-900 border-2 rounded-xl font-mono text-sm"
            placeholder='{ "Power": "24V" }'
            onChange={(e) => setFormData({...formData, technical_specs: e.target.value})} />
        </div>

        {/* Warranty & Description */}
        <div className="space-y-4">
          <input placeholder="Warranty" className="w-full p-3 border-2 rounded-xl"
            onChange={(e) => setFormData({...formData, warranty: e.target.value})} />
          <textarea rows={4} className="w-full p-4 border-2 rounded-xl"
            placeholder="Description (Markdown)"
            onChange={(e) => setFormData({...formData, description: e.target.value})} />
        </div>

        <button disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-600 transition-all">
          {loading ? "SAVING..." : "CONFIRM & PUBLISH"}
        </button>
      </form>
    </div>
  )
}