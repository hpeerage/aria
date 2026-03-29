"use client";

import { motion } from "framer-motion";
import { Sparkles, Mountain, Wind, Users, Map as MapIcon, Calendar, ArrowRight, Mail, HelpCircle, Globe, Compass } from "lucide-react";
import PlaceList from "@/components/PlaceList";
import AriaHeader from "@/components/AriaHeader";
import { Place } from "@/types/place";
import { useLanguage } from "@/lib/i18n/context";

interface HomeClientProps {
  places: Place[];
}

export default function HomeClient({ places }: HomeClientProps) {
  const { dict } = useLanguage();

  return (
    <main className="min-h-screen bg-[#F8FAF9] dark:bg-forest-dark overflow-x-hidden">
      <AriaHeader />
      {/* Hero Section with Animation */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-forest group">
        <motion.div 
          animate={{ x: [-20, 20, -20], y: [-10, 10, -10] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=1950')] bg-cover bg-center opacity-30 grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/80 to-transparent" />
        
        <motion.div 
          animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 text-white/10"
        >
          <Mountain size={120} />
        </motion.div>
        <motion.div 
          animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 right-10 text-white/10"
        >
          <Wind size={100} />
        </motion.div>

        <div className="relative z-10 text-center px-4 space-y-12 max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-accent text-sm font-black tracking-[0.3em] uppercase mb-4"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            {dict.hero.subtitle}
            <Sparkles className="w-4 h-4 animate-pulse" />
          </motion.div>
          
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-none"
            >
              {dict.hero.title1} <br />
              <span className="text-accent underline decoration-white/10 decoration-8 underline-offset-8">{dict.hero.title2}</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.6 }}
              className="text-xl md:text-2xl text-white/80 font-medium tracking-tight max-w-2xl mx-auto dark:text-white/90"
            >
              {dict.hero.description}
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col md:flex-row gap-6 justify-center pt-8"
          >
            <button className="px-10 py-5 bg-accent text-white rounded-3xl font-black text-lg hover:bg-white hover:text-forest transition-all duration-700 shadow-2xl shadow-accent/20 active:scale-95 group flex items-center gap-3 justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
              <span className="relative z-10">{dict.common.explore}</span>
              <motion.div className="relative z-10" animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </button>
            <button className="px-10 py-5 bg-white/5 backdrop-blur-3xl text-white border border-white/10 rounded-3xl font-black text-lg hover:bg-white/10 transition-all active:scale-95 border-b-4 border-white/5 active:border-b-0 active:translate-y-1">
              {dict.common.download}
            </button>
          </motion.div>

          {/* Mouse Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
          >
            <div className="w-[1px] h-12 bg-gradient-to-t from-accent to-transparent" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Scroll</span>
          </motion.div>
        </div>
      </section>

      {/* Statistics Bar */}
      <section className="relative z-20 max-w-7xl mx-auto -mt-16 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-white dark:bg-forest/50 p-10 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-forest/5 dark:border-white/10 backdrop-blur-3xl"
        >
          <StatItem icon={<MapIcon className="w-8 h-8" />} label={dict.stats.assets} value="82" suffix="Assets" />
          <StatItem icon={<Users className="w-8 h-8" />} label={dict.stats.paths} value="12" suffix="Paths" />
          <StatItem icon={<Calendar className="w-8 h-8" />} label={dict.stats.wellness} value="98%" suffix="Vitality" />
          <StatItem icon={<Sparkles className="w-8 h-8" />} label={dict.stats.newPlaces} value="24" suffix="Updated" />
        </motion.div>
      </section>

      {/* Dynamic Content: Place List */}
      <section className="relative py-20 px-4">
        <PlaceList initialPlaces={places} />
      </section>

      {/* Footer */}
      <footer className="py-24 bg-forest text-white overflow-hidden relative border-t border-white/5">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-accent" />
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter">ARIA</span>
                <span className="text-[10px] uppercase font-black tracking-[0.3em] text-white/50">Curation</span>
              </div>
            </div>
            <p className="text-sm text-white/60 font-bold leading-relaxed">
              정선의 맑은 정취와 아리랑의 선율을 담아낸 82개의 치유 거점을 제안합니다. 진정한 웰니스로 가는 길, 정선 아리아가 함께합니다.
            </p>
          </div>

          <FooterGroup label="Exploration" items={["Interactive Map", "Wellness Paths", "Local Treasures", "Season Picks"]} />
          <FooterGroup label="Resources" items={["Documentation", "API Sync", "Data Analytics", "Policy"]} />
          
          <div className="space-y-6">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-accent">Social Loop</h5>
            <div className="flex gap-4">
              {[Mail, Globe, Compass, HelpCircle].map((Icon, idx) => (
                <button key={idx} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 hover:-translate-y-1 transition-all border border-white/5">
                  <Icon className="w-4 h-4 text-white/50" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] text-center md:text-left">
            &copy; 2026 Jeongseon Wellness Tourism Project. All Rights Reserved.
          </p>
          <div className="flex gap-8 text-[9px] font-black uppercase tracking-widest text-white/50">
            <a href="#" className="hover:text-accent transition-colors">Privacy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms</a>
            <a href="#" className="hover:text-accent transition-colors">Global</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function StatItem({ icon, label, value, suffix }: { icon: React.ReactNode; label: string; value: string; suffix: string }) {
  return (
    <div className="flex flex-col items-center space-y-3 group cursor-default h-full justify-between">
      <div className="p-4 bg-forest/5 text-forest dark:bg-white/10 dark:text-accent group-hover:bg-accent group-hover:text-white rounded-[2rem] transition-all duration-700 shadow-sm group-hover:shadow-2xl group-hover:shadow-accent/30 group-hover:-translate-y-3">
        {icon}
      </div>
      <div className="text-center flex-grow flex flex-col justify-center">
        <p className="text-[10px] uppercase tracking-widest font-black text-forest/20 dark:text-white/60 group-hover:text-accent transition-colors mb-1">{label}</p>
        <p className="text-4xl font-black text-forest dark:text-white tracking-tighter group-hover:scale-110 transition-transform duration-500">{value}</p>
        <p className="text-[9px] font-black text-forest/20 dark:text-white/50 uppercase tracking-tighter">{suffix}</p>
      </div>
    </div>
  );
}

function FooterGroup({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="space-y-6">
      <h5 className="text-[10px] font-black uppercase tracking-widest text-accent">{label}</h5>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item}>
            <a href="#" className="text-xs font-bold text-white/30 hover:text-white hover:translate-x-1 inline-block transition-all">
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
