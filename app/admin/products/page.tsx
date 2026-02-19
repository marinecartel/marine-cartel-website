"use client"

import { useEffect, useState, ChangeEvent, FormEvent } from "react"
import { supabase } from "@/lib/supabase"
import { 
  Plus, Search, Edit3, Trash2, X, Image as ImageIcon, 
  Tag, Ship, DollarSign, Activity,
  LayoutGrid, List, Table as TableIcon, CheckCircle2, Loader2
} from "lucide-react"

interface Product {
  id: number;
  brand: string;
  model: string;
  model_family: string;
  category: string;
  category_main: string;
  condition: string;
  warranty: string;
  images: string[];
  description: string;
  price: string;
  price_type: string;
  slug: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'spreadsheet'>('spreadsheet')
  const [syncingId, setSyncingId] = useState<number | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("is_deleted", false)
      .order("created_at", { ascending: false })

    setProducts(data || [])
    setLoading(false)
  }

  // Quick Inline Update Logic
  async function updateField(id: number, field: string, value: string) {
    setSyncingId(id)
    const { error } = await supabase
      .from("products")
      .update({ [field]: value })
      .eq("id", id)
    
    if (error) {
      alert("Sync Error: " + error.message)
      fetchProducts() // Revert on error
    } else {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
    }
    setSyncingId(null)
  }

  async function softDelete(id: number) {
    if (!confirm("Are you sure?")) return
    await supabase.from("products").update({ is_deleted: true }).eq("id", id)
    fetchProducts()
  }

  const filteredProducts = products.filter(p => 
    p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.model?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#F1F5F9] p-4 md:p-10 font-sans text-slate-900">
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight italic uppercase">Marine <span className="text-[#0F766E]">Cartel</span></h1>
          <div className="flex items-center gap-2 mt-1">
             <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Inventory Terminal</p>
             {syncingId && <span className="flex items-center gap-1 text-[9px] font-bold text-teal-600 animate-pulse"><Loader2 size={10} className="animate-spin"/> SYNCING...</span>}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto justify-center">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              placeholder="Search assets..." 
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#0F766E] shadow-sm font-bold text-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* View Toggler */}
          <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button onClick={() => setViewMode('spreadsheet')} title="Spreadsheet Mode" className={`p-2 rounded-lg transition-all ${viewMode === 'spreadsheet' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}><TableIcon size={20}/></button>
            <button onClick={() => setViewMode('table')} title="List View" className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}><List size={20}/></button>
            <button onClick={() => setViewMode('grid')} title="Card View" className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}><LayoutGrid size={20}/></button>
          </div>

          <button
            onClick={() => { setEditing(null); setIsOpen(true); }}
            className="bg-[#0F766E] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-900 shadow-lg transition-all"
          >
            <Plus size={18} strokeWidth={3} /> Add New
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">Loading Terminal...</p>
        </div>
      ) : (
        <>
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                  <div className="aspect-square bg-white relative overflow-hidden flex items-center justify-center border-b border-slate-50">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500" alt={product.model} />
                    ) : (
                      <ImageIcon size={40} className="text-slate-100" />
                    )}
                    <div className="absolute top-4 right-4 bg-slate-900 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      {product.condition}
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] font-black text-[#0F766E] uppercase tracking-widest block mb-1">{product.brand}</span>
                    <h2 className="font-black text-slate-800 text-sm line-clamp-1 mb-1 uppercase tracking-tight italic">{product.model}</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{product.category_main}</p>
                    <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-50">
                      <span className="font-black text-slate-900 text-lg italic">{product.price_type === "fixed" ? `$${product.price}` : "POA"}</span>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditing(product); setIsOpen(true); }} className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition-all"><Edit3 size={15}/></button>
                        <button onClick={() => softDelete(product.id)} className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-red-600 hover:bg-red-50 transition-all"><Trash2 size={15}/></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewMode === 'table' && (
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Product / Brand</th>
                      <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Main Category</th>
                      <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Condition</th>
                      <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Price Status</th>
                      <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg border border-slate-100 bg-white flex items-center justify-center overflow-hidden shrink-0">
                              <img src={product.images?.[0] || ""} className="w-full h-full object-contain p-1" onError={(e) => e.currentTarget.src='https://placehold.co/40x40?text=NA'} />
                            </div>
                            <div>
                              <div className="font-black text-slate-900 text-sm uppercase italic leading-none">{product.model}</div>
                              <div className="text-[9px] font-bold text-[#0F766E] uppercase mt-1 tracking-wider">{product.brand}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-6 text-[10px] font-bold text-slate-500 uppercase">{product.category_main}</td>
                        <td className="p-6 text-[10px] font-black uppercase">{product.condition}</td>
                        <td className="p-6 font-black text-slate-900 italic text-sm">{product.price_type === 'fixed' ? `$${product.price}` : 'POA'}</td>
                        <td className="p-6 text-right">
                          <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => { setEditing(product); setIsOpen(true); }} className="p-2 text-slate-400 hover:text-blue-600"><Edit3 size={14}/></button>
                            <button onClick={() => softDelete(product.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={14}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {viewMode === 'spreadsheet' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="overflow-x-auto max-h-[70vh]">
                <table className="w-full text-left border-collapse table-fixed">
                  <thead className="sticky top-0 z-10 bg-slate-900 text-white">
                    <tr>
                      <th className="w-12 p-3 text-[9px] font-black uppercase tracking-widest text-center border-r border-slate-700">#</th>
                      <th className="w-48 p-3 text-[9px] font-black uppercase tracking-widest border-r border-slate-700 text-teal-400">Brand</th>
                      <th className="w-64 p-3 text-[9px] font-black uppercase tracking-widest border-r border-slate-700 text-teal-400">Model Name</th>
                      <th className="w-32 p-3 text-[9px] font-black uppercase tracking-widest border-r border-slate-700">Price (USD)</th>
                      <th className="w-32 p-3 text-[9px] font-black uppercase tracking-widest border-r border-slate-700">Condition</th>
                      <th className="w-40 p-3 text-[9px] font-black uppercase tracking-widest border-r border-slate-700">Main Category</th>
                      <th className="w-20 p-3 text-[9px] font-black uppercase tracking-widest text-center">Del</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-slate-50">
                    {filteredProducts.map((product, idx) => (
                      <tr key={product.id} className="bg-white hover:bg-teal-50/30 transition-colors group">
                        <td className="p-2 text-[10px] font-bold text-slate-400 text-center border-r border-slate-100">{idx + 1}</td>
                        <InlineInput value={product.brand} onSave={(val) => updateField(product.id, 'brand', val)} />
                        <InlineInput value={product.model} onSave={(val) => updateField(product.id, 'model', val)} isBold />
                        <InlineInput value={product.price} onSave={(val) => updateField(product.id, 'price', val)} />
                        <td className="p-0 border-r border-slate-100">
                          <select 
                            value={product.condition} 
                            onChange={(e) => updateField(product.id, 'condition', e.target.value)}
                            className="w-full h-10 px-2 bg-transparent text-[11px] font-bold outline-none appearance-none cursor-pointer focus:bg-white"
                          >
                            <option value="New">New</option>
                            <option value="Used">Used</option>
                            <option value="Refurbished">Refurbished</option>
                            <option value="As Is">As Is</option>
                          </select>
                        </td>
                        <InlineInput value={product.category_main} onSave={(val) => updateField(product.id, 'category_main', val)} />
                        <td className="p-2 text-center">
                          <button onClick={() => softDelete(product.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all">
                            <Trash2 size={14}/>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-200 text-[10px] font-bold text-slate-400 flex justify-between">
                <span>TOTAL: {filteredProducts.length} ASSETS</span>
                <span className="italic uppercase">Tip: Press Enter or Click away to auto-save cells</span>
              </div>
            </div>
          )}
        </>
      )}

      {isOpen && (
        <ProductModal product={editing} onClose={() => setIsOpen(false)} refresh={fetchProducts} />
      )}
    </div>
  )
}

// Inline Editable Cell Component
function InlineInput({ value, onSave, isBold = false }: { value: string, onSave: (v: string) => void, isBold?: boolean }) {
  const [local, setLocal] = useState(value)
  useEffect(() => { setLocal(value) }, [value])

  return (
    <td className="p-0 border-r border-slate-100">
      <input 
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={() => { if(local !== value) onSave(local) }}
        onKeyDown={(e) => { if(e.key === 'Enter') e.currentTarget.blur() }}
        className={`w-full h-10 px-3 bg-transparent outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-teal-500 text-[11px] transition-all ${isBold ? 'font-black uppercase' : 'font-medium'}`}
      />
    </td>
  )
}

function ProductModal({ product, onClose, refresh }: { product: Product | null, onClose: () => void, refresh: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const [form, setForm] = useState({
    brand: product?.brand || "",
    model: product?.model || "",
    model_family: product?.model_family || "",
    category: product?.category || "",
    category_main: product?.category_main || "",
    condition: product?.condition || "New",
    warranty: product?.warranty || "",
    images: Array.isArray(product?.images) ? product.images.join(", ") : "",
    description: product?.description || "",
    price: product?.price || "",
    price_type: product?.price_type || "on_request",
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const slug = `${form.brand}-${form.model}`.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "")
    const imageArray = form.images ? form.images.split(",").map((i: string) => i.trim()).filter(i => i !== "") : []
    const payload = { ...form, slug, images: imageArray }

    const { error } = product 
      ? await supabase.from("products").update(payload).eq("id", product.id)
      : await supabase.from("products").insert([payload])

    if (error) alert(error.message)
    else { refresh(); onClose(); }
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 overflow-hidden">
      <div className="bg-white w-full max-w-4xl h-[90vh] flex flex-col rounded-[2rem] shadow-2xl relative overflow-hidden">
        <div className="flex-none p-6 md:p-8 border-b bg-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase italic leading-none">
              {product ? "Edit Specifications" : "Asset Registration"}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Inventory Console</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all">
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-white">
          <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input icon={<Ship size={14}/>} label="Manufacturer" value={form.brand} onChange={(v) => setForm({...form, brand: v})} />
              <Input icon={<Tag size={14}/>} label="Model Number" value={form.model} onChange={(v) => setForm({...form, model: v})} />
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5"><Activity size={14}/> Condition</label>
                <select 
                  value={form.condition} 
                  onChange={(e) => setForm({...form, condition: e.target.value})}
                  className="w-full border border-slate-200 p-4 rounded-2xl font-bold text-sm bg-slate-50 outline-none focus:border-[#0F766E] appearance-none"
                >
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                  <option value="Refurbished">Refurbished</option>
                  <option value="As Is">As Is</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5"><DollarSign size={14}/> Pricing</label>
                <select 
                  value={form.price_type} 
                  onChange={(e) => setForm({...form, price_type: e.target.value})}
                  className="w-full border border-slate-200 p-4 rounded-2xl font-bold text-sm bg-slate-50 outline-none focus:border-[#0F766E]"
                >
                  <option value="on_request">Price on Request</option>
                  <option value="fixed">Fixed Price</option>
                </select>
              </div>

              {form.price_type === "fixed" && (
                <Input icon={<DollarSign size={14}/>} label="Price (USD)" value={form.price} onChange={(v) => setForm({...form, price: v})} />
              )}
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-teal-600 tracking-widest flex items-center gap-2">
                <ImageIcon size={14}/> Images (URLs)
              </label>
              <textarea 
                value={form.images} 
                onChange={(e) => setForm({...form, images: e.target.value})} 
                className="w-full border border-slate-200 p-4 rounded-2xl min-h-[100px] text-sm focus:border-[#0F766E] outline-none bg-slate-50"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Description</label>
              <textarea 
                value={form.description} 
                onChange={(e) => setForm({...form, description: e.target.value})} 
                className="w-full border border-slate-200 p-4 rounded-2xl min-h-[120px] text-sm focus:border-[#0F766E] outline-none bg-slate-50"
              />
            </div>
          </form>
        </div>

        <div className="flex-none p-6 md:p-8 border-t bg-slate-50 flex justify-end items-center gap-6">
          <button type="button" onClick={onClose} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900">Abort</button>
          <button form="product-form" type="submit" disabled={saving} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[#0F766E] transition-all shadow-lg shadow-slate-200 disabled:opacity-50">
            {saving ? "Syncing..." : "Commit Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}

function Input({ label, value, onChange, placeholder, icon }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string, icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5">{icon} {label}</label>
      <input
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-slate-200 p-4 rounded-2xl font-bold text-sm outline-none focus:border-[#0F766E] transition-all"
      />
    </div>
  )
}