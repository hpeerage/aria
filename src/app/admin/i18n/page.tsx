"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Save, Search, Languages, HelpCircle, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

export default function AdminI18nPage() {
  const { dict } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("common");
  const [isSaving, setIsSaving] = useState(false);

  // 딕셔너리 구조를 편집 가능한 리스트로 변환 (목업용)
  const sections = Object.keys(dict).filter(k => k !== "locale");

  return (
    <div className="space-y-12 pb-32">
      {/* Header */}
      <div className="flex justify-between items-center bg-white/5 p-10 rounded-[3rem] border border-white/10 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-12 text-accent/5">
             <Globe className="w-48 h-48 rotate-12" />
        </div>
        <div className="space-y-3 relative z-10">
          <div className="flex items-center gap-3 text-accent font-black uppercase text-[10px] tracking-[0.2em]">
             <Languages className="w-4 h-4" />
             Global Engine
          </div>
          <h3 className="text-4xl font-black text-white tracking-tighter">Dictionary Manager</h3>
          <p className="text-white/40 text-sm font-bold max-w-md">Synchronize premium translations across KO and EN interfaces in real-time.</p>
        </div>
        <button 
          onClick={() => {
            setIsSaving(true);
            setTimeout(() => setIsSaving(false), 2000);
          }}
          className="px-10 py-5 bg-accent text-white rounded-[1.5rem] font-black flex items-center gap-3 shadow-xl shadow-accent/20 hover:scale-105 transition-all relative z-10"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          Push Translations
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Tabs */}
        <aside className="space-y-4">
           <div className="text-[10px] font-black uppercase tracking-widest text-white/20 px-6 mb-6">Namespace Selection</div>
           {sections.map(section => (
             <button
               key={section}
               onClick={() => setActiveTab(section)}
               className={`w-full flex items-center justify-between px-8 py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all ${
                 activeTab === section 
                   ? "bg-white text-forest-dark shadow-xl scale-105" 
                   : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
               }`}
             >
               {section}
               {activeTab === section && <ArrowRight className="w-4 h-4" />}
             </button>
           ))}
        </aside>

        {/* Editor Area */}
        <div className="lg:col-span-3 space-y-8">
           <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-accent transition-colors" />
              <input 
                type="text" 
                placeholder={`Search keys in ${activeTab} namespace...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-[2rem] text-white placeholder:text-white/20 focus:ring-2 focus:ring-accent outline-none transition-all font-bold"
              />
           </div>

           <div className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-3xl">
              <div className="p-8 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                 <h5 className="font-black text-white uppercase tracking-widest text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    Editing: {activeTab.toUpperCase()} Namespace
                 </h5>
                 <HelpCircle className="w-5 h-5 text-white/20 cursor-help hover:text-white transition-colors" />
              </div>

              <div className="p-10 space-y-10">
                 {/* Mock Translation Rows */}
                 {Object.entries((dict as any)[activeTab] || {}).map(([key, value]) => (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key={key} 
                        className="space-y-4 group"
                    >
                       <div className="flex items-center justify-between px-2">
                          <code className="text-accent text-[10px] font-black uppercase tracking-widest">{key}</code>
                          <div className="w-1.5 h-1.5 bg-white/10 rounded-full" />
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold text-white/20 px-1 uppercase tracking-widest">KOREAN (KO)</label>
                             <input 
                                type="text" 
                                defaultValue={String(value)}
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:bg-white/10 transition-all outline-none"
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold text-white/20 px-1 uppercase tracking-widest">ENGLISH (EN)</label>
                             <input 
                                type="text" 
                                placeholder="Translate to English..."
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:bg-white/10 transition-all outline-none italic"
                             />
                          </div>
                       </div>
                    </motion.div>
                 ))}
              </div>

              {/* Warning box */}
              <div className="m-8 p-6 bg-yellow-400/5 border border-yellow-400/20 rounded-[1.5rem] flex items-center gap-4">
                 <AlertCircle className="w-6 h-6 text-yellow-400/60" />
                 <p className="text-[10px] font-bold text-yellow-400/60 leading-relaxed uppercase tracking-tighter">
                    Warning: Changing dictionary keys might disrupt interface connectivity. Ensure key-string alignment before pushing to production.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
