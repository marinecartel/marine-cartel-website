"use client";
import React, { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Anchor, Zap, AlertCircle } from "lucide-react";

export default function MarineConsole() {
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form States
  const [brandInput, setBrandInput] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [modelName, setModelName] = useState("");
  const [aiData, setAiData] = useState("");

  const [modelSpecs, setModelSpecs] = useState({
    bore: "",
    stroke: "",
    configuration: "",
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const loadMeta = async () => {
      const { data: b } = await supabase.from('marine_brands').select('*');
      const { data: c } = await supabase.from('marine_categories').select('*');
      setBrands(b || []);
      setCategories(c || []);
    };
    loadMeta();
  }, []);

  // --- AUTO FETCH MODEL DETAILS (Updated Logic) ---
  useEffect(() => {
    const fetchModelDetails = async () => {
      if (modelName.length > 2 && selectedBrandId) {
        // FIXED: Model slug ab sirf model name se check hoga
        const modelSlug = modelName.trim().toLowerCase().replace(/ /g, "-");
        
        const { data } = await supabase
          .from('marine_models')
          .select('bore, stroke, configuration, category_id')
          .eq('slug', modelSlug)
          .eq('brand_id', selectedBrandId) // FIXED: Brand ID check zaruri hai
          .single();

        if (data) {
          setModelSpecs({
            bore: data.bore || "",
            stroke: data.stroke || "",
            configuration: data.configuration || "",
          });
          if (data.category_id) setSelectedCategoryId(data.category_id);
        }
      }
    };
    const debounce = setTimeout(fetchModelDetails, 500);
    return () => clearTimeout(debounce);
  }, [modelName, selectedBrandId]);

  const handleSmartUpload = async () => {
    setLoading(true);
    try {
      let bId = selectedBrandId;
      let bName = brands.find(b => b.id === bId)?.name || brandInput.trim();

      // 1. Brand Handling
      if (!bId && brandInput) {
        const cleanName = brandInput.trim();
        const cleanSlug = cleanName.toLowerCase().replace(/ /g, "-");

        const { data: existingBrand } = await supabase
          .from('marine_brands')
          .select('id, name')
          .eq('slug', cleanSlug)
          .single();

        if (existingBrand) {
          bId = existingBrand.id;
          bName = existingBrand.name;
        } else {
          const { data: newB, error: bErr } = await supabase
            .from('marine_brands')
            .insert([{ name: cleanName, slug: cleanSlug }])
            .select().single();
          
          if (bErr) throw new Error("Brand Error: " + bErr.message);
          bId = newB.id;
          bName = cleanName;
        }
      }

      if (!bId) throw new Error("Please select or type a Brand");
      if (!selectedCategoryId) throw new Error("Please select a Category");

      // 2. Model Handling (Updated Slug & Duplicate Check)
      let mId;
      const cleanModelName = modelName.trim();
      // FIXED: Brand name ko slug se hata diya (Double brand name fix)
      const modelSlug = cleanModelName.toLowerCase().replace(/ /g, "-");

      const { data: existingModel } = await supabase
        .from('marine_models')
        .select('id')
        .eq('slug', modelSlug)
        .eq('brand_id', bId) // FIXED: Namespace check for unique brand-model pair
        .single();

      if (existingModel) {
        mId = existingModel.id;
      } else {
        const { data: modelObj, error: mErr } = await supabase
          .from('marine_models')
          .insert([{ 
            model_name: cleanModelName, 
            slug: modelSlug,
            brand_id: bId,
            category_id: selectedCategoryId,
            bore: modelSpecs.bore,
            stroke: modelSpecs.stroke,
            configuration: modelSpecs.configuration
          }])
          .select().single();

        if (mErr) throw new Error("Model Creation Failed: " + mErr.message);
        mId = modelObj.id;
      }

      // 3. Parts Insert
      const rows = aiData.split('\n').filter(r => r.trim());
      const finalParts = rows.map(row => {
        const cols = row.split('|').map(c => c.trim());
        const partName = cols[0];
        // Part slug remains unique by combining model slug and part name
        const partSlug = `${modelSlug}-${partName}`.toLowerCase().replace(/[^a-z0-9]/g, "-");
        
        return {
          part_name: partName,
          slug: partSlug,
          drawing_no: cols[1] || "N/A",
          condition: "Used working", 
          model_id: mId,
          technical_specs: { detail: cols[2] || "" }
        };
      });

      const { error: pErr } = await supabase.from('marine_spares').insert(finalParts);
      
      if (pErr) {
        if (pErr.code === '23505') throw new Error("Duplicate Parts Detected!");
        throw new Error("Parts Insert Failed: " + pErr.message);
      }

      alert("✅ Marine Stock Updated Successfully!");
      setAiData(""); setModelName("");
      setModelSpecs({ bore: "", stroke: "", configuration: "" });
      
    } catch (err: any) {
      alert("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-teal-100 p-3 rounded-xl text-teal-600">
            <Anchor size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase text-slate-800">Marine Inventory Console</h1>
            <p className="text-xs text-slate-400 font-bold uppercase">Linked to Alang Stock Database</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Brand</label>
            <input 
              list="brand-list"
              className="w-full p-4 bg-gray-50 border rounded-xl font-bold uppercase text-xs outline-none focus:ring-2 ring-teal-500"
              placeholder="e.g. YANMAR"
              onChange={(e) => {
                const match = brands.find(b => b.name.toLowerCase() === e.target.value.toLowerCase());
                if (match) setSelectedBrandId(match.id);
                else { setSelectedBrandId(""); setBrandInput(e.target.value); }
              }}
            />
            <datalist id="brand-list">
              {brands.map(b => <option key={b.id} value={b.name} />)}
            </datalist>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Category</label>
            <select 
              className="w-full p-4 bg-gray-50 border rounded-xl font-bold uppercase text-xs outline-none"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Engine Model</label>
            <input 
              className="w-full p-4 bg-gray-50 border rounded-xl font-bold uppercase text-xs outline-none focus:ring-2 ring-teal-500"
              placeholder="e.g. 6EY18L"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8 border-t pt-6 border-dashed">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bore (mm)</label>
            <input 
              className="w-full p-4 bg-slate-50 border rounded-xl font-bold text-xs outline-none"
              placeholder="180"
              value={modelSpecs.bore}
              onChange={(e) => setModelSpecs({...modelSpecs, bore: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stroke (mm)</label>
            <input 
              className="w-full p-4 bg-slate-50 border rounded-xl font-bold text-xs outline-none"
              placeholder="280"
              value={modelSpecs.stroke}
              onChange={(e) => setModelSpecs({...modelSpecs, stroke: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Configuration</label>
            <input 
              className="w-full p-4 bg-slate-50 border rounded-xl font-bold text-xs outline-none uppercase"
              placeholder="L-Type / V-Type"
              value={modelSpecs.configuration}
              onChange={(e) => setModelSpecs({...modelSpecs, configuration: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2 mb-8">
          <div className="flex justify-between items-center">
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Bulk Spare Parts (AI Copy-Paste)</label>
             <span className="text-[9px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">Format: Part Name | Drawing No | Specs</span>
          </div>
          <textarea 
            className="w-full h-64 p-6 bg-slate-900 text-teal-400 font-mono text-xs rounded-2xl outline-none border-4 border-slate-800"
            placeholder="Piston Crown | 146673-22120 | Steel Alloy"
            value={aiData}
            onChange={(e) => setAiData(e.target.value)}
          />
        </div>

        <button 
          onClick={handleSmartUpload}
          disabled={loading}
          className="w-full py-5 bg-teal-500 text-white rounded-xl font-black uppercase tracking-[0.2em] shadow-lg shadow-teal-100 hover:bg-teal-600 transition-all flex items-center justify-center gap-3"
        >
          {loading ? "Processing..." : <><Zap size={18} /> Sync to Database</>}
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3 items-start">
        <AlertCircle className="text-amber-500 shrink-0" size={18} />
        <p className="text-[10px] text-amber-700 font-bold uppercase leading-relaxed">
          Note: Model slugs are now unique per brand. Auto-URL: <b>brand/model/part</b>.
        </p>
      </div>
    </div>
  );
}