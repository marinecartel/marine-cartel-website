import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    /* Humne yahan 'data-admin' add kiya hai taaki globals.css is area ko ignore kare */
    <div data-admin="true" className="flex min-h-screen bg-gray-100 font-sans selection:bg-blue-100" style={{ colorScheme: 'light' }}>
      
      {/* Sidebar - Sticky Position */}
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col h-screen sticky top-0 shadow-2xl z-50">
        <div className="mb-10 px-2">
          <h2 className="text-2xl font-black tracking-tighter text-blue-400 italic">MARINE CARTEL</h2>
          <div className="h-1 w-12 bg-blue-500 mt-1 rounded-full"></div>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-2">Control Panel v2.0</p>
        </div>
        
        <nav className="space-y-2 flex-1">
          {/* 1. Inventory Link */}
          <Link 
            href="/admin/dashboard" 
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-all font-bold text-sm border-l-4 border-transparent hover:border-blue-500 group"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">📦</span>
            Inventory List
          </Link>
          
          {/* 2. Bulk Upload Link (NEW) */}
          <Link 
            href="/admin/products/bulk" 
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-all font-bold text-sm border-l-4 border-transparent hover:border-green-500 group"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">🚀</span>
            Bulk Upload (CSV)
          </Link>

          {/* 3. Single Add Link */}
          <Link 
            href="/admin/products/new" 
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-all font-bold text-sm border-l-4 border-transparent hover:border-yellow-500 group"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">➕</span>
            Add Single Product
          </Link>

          

<div className="mt-8 mb-4 px-2">
  <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Marine Division</p>
</div>

<Link 
  href="/admin/marine/console" 
  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-all font-bold text-sm border-l-4 border-transparent hover:border-teal-500 group"
>
  <span className="text-lg group-hover:scale-110 transition-transform">⚓</span>
  Marine Console
</Link>

<Link 
  href="/admin/marine/list" 
  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-all font-bold text-sm border-l-4 border-transparent hover:border-blue-400 group"
>
  <span className="text-lg group-hover:scale-110 transition-transform">📋</span>
  Spare Inventory
</Link>
        </nav>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-slate-800">
          <button className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-black text-xs uppercase tracking-widest">
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-x-hidden bg-gray-100">
        <div className="max-w-[1500px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}