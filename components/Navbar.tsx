"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ArrowRight, PhoneCall } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrolled(currentScrollY > 20)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false)
        setIsOpen(false) 
      } else {
        setVisible(true)
      }
      setLastScrollY(currentScrollY)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Inventory", href: "/products" },
    { name: "Reviews", href:"/reviews"},
    { name: "Contact", href: "/contact" },
    { name: "About Us", href:"/about"}
  ]

  return (
    <header 
      className={`sticky top-0 z-[100] w-full transition-all duration-500 ease-in-out ${
        scrolled 
        ? "bg-white/80 backdrop-blur-xl py-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] border-b border-slate-200/50" 
        : "bg-white py-5"
      } ${
        visible ? "translate-y-0" : "-translate-y-full shadow-none"
      }`}
    >
      {/* Container - Desktop pe px-6 rakha hai wapis */}
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center overflow-x-hidden">

        {/* Logo Section - Design restored to original */}
        <Link href="/" className="group flex items-center gap-2.5 outline-none shrink-0">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white transition-transform group-hover:rotate-12 duration-300">
            <img 
              src="/logo_mc.png" 
              alt="Marine Cartel Logo" 
              className="h-12 w-auto object-contain transition-transform group-hover:scale-105 duration-300"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-[900] tracking-tighter text-slate-900 leading-none">
              MARINE <span className="text-[#0F766E]">CARTEL</span>
            </span>
            {/* Mobile pe width control karne ke liye bas 'truncate' ya 'max-w' ki limit lagayi hai jo mobile pe dikhegi */}
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 whitespace-nowrap overflow-hidden max-w-[140px] md:max-w-none">
              From Ocean to Outlets
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 whitespace-nowrap overflow-hidden max-w-[140px] md:max-w-none">
              Industrial Automation
            </span>
          </div>
        </Link>

        {/* Desktop Menu - Restored gap-10 and gap-8 */}
        <nav className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href} 
                className="relative text-[13px] font-bold uppercase tracking-widest text-slate-500 hover:text-[#0F766E] transition-colors group"
              >
                {link.name}
                <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-[#0F766E] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="h-6 w-px bg-slate-200 mx-2" />

          <Link 
            href="https://wa.me/917405558403"
            target="_blank"
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-[#0F766E] hover:shadow-lg hover:shadow-teal-900/20 transition-all active:scale-95"
          >
            <PhoneCall size={14} />
            Quick Quote
          </Link>
        </nav>

        {/* Mobile Toggle Button - Original Size */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden w-11 h-11 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-900 hover:bg-slate-100 transition-all outline-none shrink-0"
        >
          {isOpen ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
        </button>
      </div>

      {/* Mobile Menu logic - Restored to original but with better positioning */}
      <div 
        className={`fixed inset-x-0 md:hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-[101] ${
          isOpen 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
        style={{ top: scrolled ? '65px' : '85px' }} // Dynamic top position taaki gap na aaye
      >
        <div className="mx-4 bg-white rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden mt-2">
          <nav className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-6 py-4 rounded-2xl bg-slate-50/50 hover:bg-teal-50 text-slate-700 hover:text-[#0F766E] font-bold text-sm transition-all group"
              >
                {link.name}
                <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </Link>
            ))}
            <div className="mt-4 p-2">
              <Link 
                href="https://wa.me/917405558403"
                target="_blank"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-3 w-full py-5 bg-[#0F766E] text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-teal-900/20 active:scale-95 transition-transform"
              >
                <PhoneCall size={18} />
                Get Instant Pricing
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[-1] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </header>
  )
}