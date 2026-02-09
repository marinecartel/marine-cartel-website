"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ArrowRight, Ship, PhoneCall } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Scroll logic for hiding/showing and glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // 1. Handle Glassmorphism effect
      setScrolled(currentScrollY > 20)

      // 2. Handle Hide/Show logic
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling Down - Hide Nav
        setVisible(false)
        setIsOpen(false) // Auto-close mobile menu on scroll
      } else {
        // Scrolling Up - Show Nav
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
    { name: "Contact", href: "/contact" },
  ]

  return (
    <header 
      className={`sticky top-0 z-[100] transition-all duration-500 ease-in-out ${
        scrolled 
        ? "bg-white/80 backdrop-blur-xl py-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] border-b border-slate-200/50" 
        : "bg-white py-5"
      } ${
        visible ? "translate-y-0" : "-translate-y-full shadow-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

        {/* Logo Section */}
        <Link href="/" className="group flex items-center gap-2.5 outline-none">
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
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
              From Ocean to Outlets
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
              Industrial Automation
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
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

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden w-11 h-11 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-900 hover:bg-slate-100 transition-all outline-none"
        >
          {isOpen ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div 
        className={`fixed inset-x-0 top-[73px] md:hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isOpen 
          ? "opacity-100 translate-y-0 pointer-events-auto" 
          : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
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

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[-1] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </header>
  )
}