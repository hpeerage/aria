"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X, Sparkles, Clock, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";

export default function AriaHeader() {
  const { locale, setLocale, dict } = useLanguage();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("aria_recent_searches");
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch {}
  }, []);

  // Keyboard shortcut: Cmd+K / Ctrl+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto-focus input when overlay opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
      setSearchQuery("");
    }
  }, [isSearchOpen]);

  const saveRecentSearch = useCallback((term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem("aria_recent_searches", JSON.stringify(updated));
    } catch {}
  }, [recentSearches]);

  const handleSearch = useCallback((term: string) => {
    if (!term.trim()) return;
    saveRecentSearch(term);
    setIsSearchOpen(false);
    router.push(`/?q=${encodeURIComponent(term.trim())}#list`);
  }, [saveRecentSearch, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const quickLinks = [
    { label: dict.categories.nature, query: "자연" },
    { label: dict.categories.water, query: "동굴" },
    { label: dict.categories.activity, query: "체험" },
    { label: dict.categories.food, query: "맛집" },
    { label: dict.categories.culture, query: "문화" },
    { label: dict.categories.stay, query: "숙소" },
  ];

  const navItems = [
    { title: dict.common.all || "Home", href: "/" },
    { title: "Map", href: "#map" },
    { title: "Discovery", href: "#list" },
  ];

  return (
    <>
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
              <div className={`relative transition-all duration-500 ${
                isScrolled ? "h-8 w-20" : "h-12 w-32"
              }`}>
                <Image 
                  src="/aria/images/logo.svg" 
                  alt="Jeongseon Aria" 
                  fill
                  className={`object-contain transition-all duration-500 group-hover:scale-110 ${
                    !isScrolled ? "brightness-0 invert opacity-80" : ""
                  }`}
                />
              </div>
              {!isScrolled && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col border-l border-white/20 pl-3 ml-1"
                >
                  <span className="text-xs font-black tracking-widest text-white uppercase leading-tight">Jeongseon</span>
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Wellness</span>
                </motion.div>
              )}
            </Link>

            {/* Desktop Nav Items */}
            <div className="hidden md:flex items-center gap-10">
              {navItems.map((item) => (
                <Link 
                  key={item.title} 
                  href={item.href}
                  className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-accent ${
                    isScrolled ? "text-forest/60 dark:text-white/70" : "text-white/70"
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center bg-forest/5 dark:bg-white/10 rounded-2xl p-1 border border-forest/10 dark:border-white/10">
                <button 
                  onClick={() => setLocale("ko")}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${
                    locale === "ko" ? "bg-forest dark:bg-accent text-white shadow-lg" : "text-forest/40 dark:text-white/40 hover:text-forest dark:hover:text-white"
                  }`}
                >
                  KO
                </button>
                <button 
                  onClick={() => setLocale("en")}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${
                    locale === "en" ? "bg-forest dark:bg-accent text-white shadow-lg" : "text-forest/40 dark:text-white/40 hover:text-forest dark:hover:text-white"
                  }`}
                >
                  EN
                </button>
              </div>
              
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl transition-all ${
                  isScrolled 
                    ? "bg-forest text-white shadow-xl shadow-forest/20 hover:bg-accent" 
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:block text-[10px] font-black uppercase tracking-widest">검색</span>
                <span className={`hidden lg:flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-lg ${
                  isScrolled ? "bg-white/20 text-white/70" : "bg-white/10 text-white/50"
                }`}>
                  ⌘K
                </span>
              </motion.button>

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
              className="absolute top-24 left-6 right-6 p-8 bg-white dark:bg-forest rounded-[3rem] shadow-2xl border border-forest/5 z-[90] flex flex-col gap-8 max-h-[85vh] overflow-y-auto scrollbar-hide"
            >
              {/* Categories Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-forest/30 dark:text-white/20 uppercase tracking-[0.3em] ml-1">Explore Categories</p>
                  <TrendingUp className="w-3 h-3 text-accent animate-pulse" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {quickLinks.map((link) => (
                    <button
                      key={link.query}
                      onClick={() => {
                        handleSearch(link.query);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-between px-5 py-4 bg-forest/[0.03] dark:bg-white/[0.04] border border-forest/5 dark:border-white/5 rounded-2xl group hover:border-accent/30 hover:bg-accent/[0.02] transition-all text-left"
                    >
                      <span className="text-sm font-black text-forest/70 dark:text-white/70 group-hover:text-accent transition-colors">
                        {link.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Switch for Mobile */}
              <div className="flex items-center justify-between pt-4">
                <p className="text-[10px] font-black text-forest/30 dark:text-white/20 uppercase tracking-[0.3em] ml-1">Language</p>
                <div className="flex bg-forest/5 dark:bg-white/10 rounded-xl p-1">
                  <button 
                    onClick={() => setLocale("ko")}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${
                      locale === "ko" ? "bg-forest dark:bg-accent text-white shadow-lg" : "text-forest/40 dark:text-white/40"
                    }`}
                  >
                    KO
                  </button>
                  <button 
                    onClick={() => setLocale("en")}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${
                      locale === "en" ? "bg-forest dark:bg-accent text-white shadow-lg" : "text-forest/40 dark:text-white/40"
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ⭐ Full-Screen Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[200] bg-forest-dark/80 backdrop-blur-xl"
              onClick={() => setIsSearchOpen(false)}
            />

            {/* Search Panel */}
            <motion.div
              initial={{ opacity: 0, y: -40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed top-6 left-0 right-0 mx-auto w-[92vw] md:w-full md:max-w-2xl z-[201]"
            >
              <div className="bg-white dark:bg-[#0C1A14] rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border border-forest/10 dark:border-white/10 overflow-hidden">
                
                {/* Search Input */}
                <form onSubmit={handleSubmit} className="flex items-center gap-4 px-8 pt-8 pb-6 border-b border-forest/5 dark:border-white/5">
                  <Search className="w-6 h-6 text-accent flex-shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={dict.common.searchPlaceholder || "장소, 카테고리, 키워드 검색..."}
                    className="flex-1 bg-transparent outline-none text-xl font-bold text-forest dark:text-white placeholder:text-forest/30 dark:placeholder:text-white/30"
                  />
                  <div className="flex items-center gap-2">
                    {searchQuery && (
                      <motion.button
                        type="submit"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="px-4 py-2 bg-accent text-white rounded-xl font-black text-sm hover:bg-accent/80 transition-colors"
                      >
                        검색
                      </motion.button>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(false)}
                      className="p-2 rounded-xl bg-forest/5 dark:bg-white/5 text-forest/60 dark:text-white/40 hover:text-forest dark:hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                <div className="px-8 py-6 space-y-6 max-h-[60vh] overflow-y-auto">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-forest/40 dark:text-white/30">
                        <Clock className="w-3 h-3" />
                        최근 검색어
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((term) => (
                          <motion.button
                            key={term}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleSearch(term)}
                            className="flex items-center gap-2 px-4 py-2 bg-forest/5 dark:bg-white/5 border border-forest/10 dark:border-white/10 rounded-2xl text-sm font-bold text-forest/70 dark:text-white/70 hover:border-accent/40 hover:text-accent transition-all"
                          >
                            <Clock className="w-3 h-3 opacity-50" />
                            {term}
                          </motion.button>
                        ))}
                        <button
                          onClick={() => {
                            setRecentSearches([]);
                            localStorage.removeItem("aria_recent_searches");
                          }}
                          className="px-3 py-2 text-[10px] font-black text-forest/30 dark:text-white/20 hover:text-red-400 transition-colors uppercase tracking-wider"
                        >
                          지우기
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Quick Category Links */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-forest/40 dark:text-white/30">
                      <TrendingUp className="w-3 h-3" />
                      카테고리 바로가기
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {quickLinks.map((link) => (
                        <motion.button
                          key={link.query}
                          whileHover={{ x: 4 }}
                          onClick={() => handleSearch(link.query)}
                          className="flex items-center justify-between px-5 py-3 bg-forest/[0.03] dark:bg-white/[0.04] border border-forest/5 dark:border-white/5 rounded-2xl group hover:border-accent/30 hover:bg-accent/5 transition-all text-left"
                        >
                          <span className="text-sm font-bold text-forest/70 dark:text-white/70 group-hover:text-accent transition-colors">
                            {link.label}
                          </span>
                          <ArrowRight className="w-3 h-3 text-forest/20 dark:text-white/20 group-hover:text-accent transition-colors" />
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Keyboard hint */}
                  <div className="flex items-center justify-center gap-4 text-[10px] font-black text-forest/20 dark:text-white/20 uppercase tracking-widest pt-2 border-t border-forest/5 dark:border-white/5">
                    <span>Enter — 검색</span>
                    <span>·</span>
                    <span>Esc — 닫기</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
