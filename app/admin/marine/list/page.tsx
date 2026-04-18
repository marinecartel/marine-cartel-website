"use client";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { Trash2, Edit3, Search, Anchor, AlertTriangle, X, Save } from "lucide-react";

export default function MarineListPage() {
  const [spares, setSpares] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [editingItem, setEditingItem] = useState<any>(null); // EDIT MODAL STATE

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchMarineSpares = async () => {
    setLoading(true);
    const { data, error, count } = await supabase
      .from("marine_spares")
      .select(`
        *,
        marine_models (
          model_name,
          marine_brands (name)
        )
      `, { count: 'exact' })
      .order("created_at", { ascending: false });

    if (!error) {
      setSpares(data || []);
      if (count !== null) setTotalCount(count);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMarineSpares();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Kya aap waqayi is part ko delete karna chahte hain?")) {
      const { error } = await supabase.from('marine_spares').delete().eq('id', id);
      if (error) alert("Delete fail: " + error.message);
      else {
        alert("Part Deleted!");
        setSpares(prev => prev.filter(item => item.id !== id));
      }
    }
  };

  // EDIT UPDATE LOGIC
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('marine_spares')
      .update({
        part_name: editingItem.part_name,
        drawing_no: editingItem.drawing_no,
        technical_specs: editingItem.technical_specs
      })
      .eq('id', editingItem.id);

    if (!error) {
      setEditingItem(null);
      fetchMarineSpares();
      alert("✅ Inventory Updated!");
    } else {
      alert("❌ Error: " + error.message);
    }
  };

  // Data Health Check Logic (FIXED COLUMN NAMES)
  const getHealthStatus = (item: any) => {
    const issues = [];
    if (!item.drawing_no || item.drawing_no === "N/A" || item.drawing_no === "TBA") issues.push("No Dwg");
    // Database mein technical_specs hai, 
    if (!item.technical_specs || !item.technical_specs.detail || item.technical_specs.detail.trim() === "") {
      issues.push("No Specs");
    }
    return issues;
  };

  const filteredSpares = spares.filter(s => 
    s.part_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.marine_models?.model_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-3xl border shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-2">
            <Anchor className="text-teal-500" /> Marine Spare Inventory
          </h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">
            Total Components: <span className="text-teal-600">{totalCount} Items</span>
          </p>
        </div>
        
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="SEARCH PART OR ENGINE..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl text-xs font-bold uppercase outline-none focus:ring-2 ring-teal-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link href="/admin/marine/console" className="bg-teal-500 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-teal-600 transition-all shadow-lg shadow-teal-100">
            + Quick Add
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Component Details</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Engine Model</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Data Health</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={4} className="p-20 text-center text-slate-300 font-black uppercase tracking-[0.3em] animate-pulse">Scanning Marine Database...</td></tr>
            ) : filteredSpares.map((item) => {
              const issues = getHealthStatus(item);
              return (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-6">
                    <div className="font-black text-slate-800 uppercase text-sm">{item.part_name}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mt-1">
                      DWG: <span className={item.drawing_no === 'N/A' ? 'text-red-400' : 'text-slate-600'}>{item.drawing_no}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-1">
                      {item.marine_models?.marine_brands?.name}
                    </div>
                    <div className="font-bold text-slate-700 uppercase text-xs">{item.marine_models?.model_name}</div>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center gap-2">
                      {issues.length > 0 ? (
                        issues.map(issue => (
                          <span key={issue} className="bg-amber-50 text-amber-600 text-[9px] px-2 py-1 rounded-md border border-amber-100 font-black uppercase flex items-center gap-1">
                            <AlertTriangle size={10} /> {issue}
                          </span>
                        ))
                      ) : (
                        <span className="bg-teal-50 text-teal-600 text-[9px] px-2 py-1 rounded-md border border-teal-100 font-black uppercase">
                          Perfect ✅
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end items-center gap-4">
                      {/* FIXED EDIT BUTTON: AB MODAL KHULEGA */}
                      <button 
                        onClick={() => setEditingItem(item)}
                        className="p-2 hover:bg-teal-50 rounded-lg text-slate-400 hover:text-teal-600 transition-all"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-50 rounded-lg text-slate-300 hover:text-red-500 transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* --- EDIT MODAL (POPUP) --- */}
      {editingItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden border">
            <div className="p-8 bg-slate-50 border-b flex justify-between items-center">
              <div>
                <h2 className="font-black uppercase text-slate-800 tracking-tighter text-xl">Edit Component</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Update database information</p>
              </div>
              <button onClick={() => setEditingItem(null)} className="p-3 hover:bg-slate-200 rounded-full transition-all"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Part Name</label>
                  <input 
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold uppercase text-xs focus:ring-2 ring-teal-500 outline-none"
                    value={editingItem.part_name}
                    onChange={(e) => setEditingItem({...editingItem, part_name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Drawing No</label>
                  <input 
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold uppercase text-xs focus:ring-2 ring-teal-500 outline-none"
                    value={editingItem.drawing_no}
                    onChange={(e) => setEditingItem({...editingItem, drawing_no: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Technical Specs</label>
                <textarea 
                  className="w-full h-32 p-5 bg-slate-900 text-teal-400 font-mono text-xs rounded-2xl outline-none border-4 border-slate-800"
                  value={editingItem.technical_specs?.detail || ""}
                  onChange={(e) => setEditingItem({
                    ...editingItem, 
                    technical_specs: { detail: e.target.value }
                  })}
                />
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-teal-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-teal-600 shadow-xl shadow-teal-100 transition-all"
              >
                <Save size={18} /> Update Marine Spare
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}