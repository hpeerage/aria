"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X, Sparkles } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";

export default function AriaHeader() {
  const { locale, setLocale, dict } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { title: dict.common.all || "Home", href: "/" },
    { title: "Map", href: "#map" },
    { title: "Discovery", href: "#list" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 px-6 py-4 ${
        isScrolled ? "pt-4" : "pt-8"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <nav 
          className={`flex items-center justify-between px-8 py-3 rounded-[2.5rem] transition-all duration-700 ${
            isScrolled 
              ? "bg-white/80 dark:bg-forest/80 backdrop-blur-2xl shadow-2xl border border-forest/5 py-3" 
              : "bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/10 py-5"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className={`p-2 rounded-xl transition-all duration-500 ${
              isScrolled ? "bg-forest/5 text-forest" : "bg-white/10 text-white"
            } group-hover:scale-110 group-hover:rotate-12`}>
              <Sparkles className={`w-5 h-5 ${isScrolled ? "text-accent" : "text-white"}`} />
            </div>
            <div className="flex flex-col">
              <span className={`text-lg font-black tracking-tighter transition-colors ${
                isScrolled ? "text-forest" : "text-white"
              }`}>
                JEONGSEON ARIA
              </span>
              <span className={`text-[8px] font-black tracking-[0.3em] uppercase transition-colors ${
                isScrolled ? "text-forest/30" : "text-white/40"
              }`}>
                Wellness Curation
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <Link 
                key={item.title} 
                href={item.href}
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-accent ${
                  isScrolled ? "text-forest/60" : "text-white/70"
                }`}
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center bg-forest/5 rounded-2xl p-1 border border-forest/10">
              <button 
                onClick={() => setLocale("ko")}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${
                  locale === "ko" ? "bg-forest text-white shadow-lg" : "text-forest/40 hover:text-forest"
                }`}
              >
                KO
              </button>
              <button 
                onClick={() => setLocale("en")}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${
                  locale === "en" ? "bg-forest text-white shadow-lg" : "text-forest/40 hover:text-forest"
                }`}
              >
                EN
              </button>
            </div>
            
            <button className={`p-3 rounded-2xl transition-all hover:scale-110 ${
              isScrolled ? "bg-forest text-white shadow-xl shadow-forest/20" : "bg-white/10 text-white"
            }`}>
              <Search className="w-5 h-5" />
            </button>
            <button 
              className="md:hidden p-3 rounded-2xl bg-forest/5 text-forest"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-24 left-6 right-6 p-8 bg-white dark:bg-forest rounded-[3rem] shadow-2xl border border-forest/5 z-[90] flex flex-col gap-6"
          >
            {navItems.map((item) => (
              <Link 
                key={item.title} 
                href={item.href}
                className="text-lg font-black text-forest hover:text-accent transition-colors py-2 border-b border-forest/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.title}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
