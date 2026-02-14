"use client"

import { useEffect, useState } from "react"
import { Star, ShieldCheck, Globe, ChevronDown, CheckCircle2, Factory, Ship } from "lucide-react"

export default function ReviewsGrid({ reviews, averageRating }: any) {
  const [rating, setRating] = useState(0)
  const [count, setCount] = useState(0)
  const [visibleCount, setVisibleCount] = useState(9)

  useEffect(() => {
    let r = 0; let c = 0;
    const interval = setInterval(() => {
      if (r < averageRating) { r += 0.1; setRating(parseFloat(r.toFixed(1))); }
      if (c < reviews.length) { c += 2; setCount(c); }
      if (r >= averageRating && c >= reviews.length) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [averageRating, reviews.length]);

  return (
    <div className="bg-white text-slate-900">
      
      {/* CORPORATE TRUST HEADER */}
      <section className="bg-slate-50 border-b border-slate-200 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-[100px] font-black uppercase tracking-widest mb-6">
                <ShieldCheck size={20} /> 100% Authentic Feedback
              </div>
              <h1 className="text-5xl font-[900] tracking-tight text-slate-900 mb-6 leading-[1.1]">
                Global Reliability <br/>
                <span className="text-[#0F766E]">Proven by Data.</span>
              </h1>
              <p className="text-slate-500 text-lg max-w-lg mb-8 font-medium">
                We supply critical automation parts to 50+ countries. Here is what the chief engineers and procurement officers say about Marine Cartel.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm text-sm font-bold text-slate-700">
                   <Ship size={20} className="text-[#0F766E]"/> 500+ Item Served
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm text-sm font-bold text-slate-700">
                   <Globe size={20} className="text-[#0F766E]"/> Worldwide Shipping
                </div>
              </div>
            </div>

            {/* RATING SUMMARY BOX - Fixed Design */}
<div className="bg-[#0F766E] rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-center gap-10 border border-teal-500/30">
  
  {/* Stats Left */}
  <div className="flex flex-col items-center shrink-0">
    <div className="text-7xl md:text-8xl font-black tracking-tighter leading-none">
      {rating}
    </div>
    <div className="flex gap-1 mt-4">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          size={20} 
          fill="#fbbf24" 
          className="text-yellow-400" 
        />
      ))}
    </div>
    <div className="mt-4 px-4 py-1 bg-teal-900/40 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-teal-200 border border-teal-400/20">
      {count}+ Verified Reviews
    </div>
  </div>
  
  {/* Divider Line */}
  <div className="hidden sm:block h-28 w-px bg-gradient-to-b from-transparent via-teal-400/40 to-transparent" />
  
  {/* Progress Bars Right */}
  <div className="flex-1 w-full space-y-4">
    {[
      { label: "5★", width: "94%", count: "92" },
      { label: "4★", width: "12%", count: "8" },
      { label: "3★", width: "2%", count: "1" }
    ].map((item) => (
      <div key={item.label} className="flex items-center gap-4">
        <span className="text-xs font-black text-teal-200 w-6">{item.label}</span>
        <div className="flex-1 h-2.5 bg-teal-950/50 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-1000 ease-out" 
            style={{ width: item.width }}
          />
        </div>
        <span className="text-[10px] font-bold text-teal-300 w-8">{item.width}</span>
      </div>
    ))}
  </div>

  
  
</div>

          </div>
        </div>
      </section>

      {/* REVIEWS GRID */}
      <section className="max-w-7xl mx-auto py-24 px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.slice(0, visibleCount).map((r: any, i: number) => (
            <div key={i} className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-[0_20px_40px_-15px_rgba(15,118,110,0.1)] hover:border-teal-100 transition-all duration-300">
              <div className="flex gap-0.5 text-yellow-500 mb-6">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} size={14} fill={idx < r.rating ? "currentColor" : "none"} className={idx < r.rating ? "" : "text-slate-200"} />
                ))}
              </div>

              <p className="text-slate-700 font-medium leading-[1.6] mb-8 min-h-[100px]">
                "{r.review}"
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center font-black text-[#0F766E] text-xs">
                  {r.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-slate-900 text-[13px] uppercase tracking-tight">{r.name}</span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{r.company} • {r.country}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* LOAD MORE */}
        {visibleCount < reviews.length && (
          <div className="mt-20 text-center">
            <button 
              onClick={() => setVisibleCount(prev => prev + 9)}
              className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-[#0F766E] transition-all active:scale-95 shadow-xl shadow-slate-200"
            >
              Load More Testimonials
            </button>
          </div>
        )}
      </section>
    </div>
  )
}